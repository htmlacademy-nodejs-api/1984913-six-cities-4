import { inject, injectable } from 'inversify';
import { Request, Response, NextFunction } from 'express';
import { Controller } from '../../controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { LoggerInterface } from '../../../types/core/logger.interface';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import { UserServiceInterface } from './user-service.interface';
import CreateUserDto from './dto/create-user.dto.js';
import HttpError from '../../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import { ConfigInterface } from '../../../types/core/config.interface.js';
import UserRdo from './rdo/user.rdo.js';
import { createJWT, fillDTO } from '../../helpers/common.js';
import LoginUserDto from './dto/login-user.dto.js';
import { ControllerRoute, ObjectIdParam } from '../../../utils/constants.js';
import { UnknownRecord } from '../../../types/unknown-record.type.js';
import { ValidateDTOMiddleware } from '../../middleware/validate-dto.middleware.js';
import { ConfigSchema } from '../../../types/core/config-schema.type.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../middleware/upload-file.middleware.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import { JWT_ALGORITHM } from './user.constants.js';

@injectable()
export default class UserController extends Controller {
  private readonly name = AppComponent.UserController.description;
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface)
    private readonly configService: ConfigInterface<ConfigSchema>
  ) {
    super(logger);

    this.logger.info(LoggerInfoMessage.RegisterRoute.concat('UserController'));

    this.addRoute({
      path: ControllerRoute.Login,
      method: HttpMethod.Get,
      handler: this.check,
    });
    this.addRoute({
      path: ControllerRoute.Login,
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDTOMiddleware(LoginUserDto)],
    });
    this.addRoute({
      path: ControllerRoute.Register,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDTOMiddleware(CreateUserDto)],
    });
    this.addRoute({
      path: ControllerRoute.Logout,
      method: HttpMethod.Delete,
      handler: this.logout,
    });
    this.addRoute({
      path: ControllerRoute.User.concat(ControllerRoute.Avatar),
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware(ObjectIdParam.UserId),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), 'avatar'),
      ]
    });
  }

  public async create(
    { body }: Request<UnknownRecord, UnknownRecord, CreateUserDto>,
    res: Response,
    _next: NextFunction
  ): Promise<void> {
    const existsUser = await this.userService.findByEmail(body.email);

    if (existsUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email "${body.email}" exists.`,
        this.name
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT')
    );
    this.created(res, fillDTO(UserRdo, result));
  }

  public async login(
    { body }: Request<UnknownRecord, UnknownRecord, LoginUserDto>,
    res: Response
  ): Promise<void> {
    const user = await this.userService.verifyUser(body, this.configService.get('SALT'));

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'User unauthorized',
        this.name
      );
    }
    const token = await createJWT(JWT_ALGORITHM, this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );

    this.ok(res, fillDTO(LoggedUserRdo, {
      email: user.email,
      token
    }));
  }

  public async check({ body }: Request, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);
    this.ok(res, fillDTO(UserRdo, user));
  }

  public async uploadAvatar(req: Request, res: Response) {
    this.created(res, {filepath: req.file?.path});
  }

  public async logout() {
    throw new HttpError(StatusCodes.NO_CONTENT, 'No content', this.name);
  }
}
