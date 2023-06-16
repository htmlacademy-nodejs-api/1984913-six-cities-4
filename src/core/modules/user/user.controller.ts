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
import { ControllerRoute, ErrorMessage, ImageFieldName, ObjectIdParam } from '../../../utils/constants.js';
import { UnknownRecord } from '../../../types/unknown-record.type.js';
import { ValidateDTOMiddleware } from '../../middleware/validate-dto.middleware.js';
import { ConfigSchema } from '../../../types/core/config-schema.type.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { UploadFileMiddleware } from '../../middleware/upload-file.middleware.js';
import LoggedUserRdo from './rdo/logged-user.rdo.js';
import { JWT_ALGORITHM } from './user.constants.js';
import UploadAvatarRdo from './rdo/upload-avatar.rdo.js';

@injectable()
export default class UserController extends Controller {
  private readonly name = AppComponent.UserController.description;
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.UserServiceInterface)
    private readonly userService: UserServiceInterface,
    @inject(AppComponent.ConfigInterface)
    protected readonly configService: ConfigInterface<ConfigSchema>
  ) {
    super(logger, configService);

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
      path: ControllerRoute.User.concat('/', ImageFieldName.Avatar),
      method: HttpMethod.Post,
      handler: this.uploadAvatar,
      middlewares: [
        new ValidateObjectIdMiddleware(ObjectIdParam.UserId),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), ImageFieldName.Avatar),
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
        `User with email ${body.email} exists.`,
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
        ErrorMessage.Unauthorized,
        this.name
      );
    }
    const token = await createJWT(JWT_ALGORITHM, this.configService.get('JWT_SECRET'),
      {
        email: user.email,
        id: user.id
      }
    );

    this.ok(res, {...fillDTO(LoggedUserRdo, user), token});
  }

  public async check({ user }: Request, res: Response): Promise<void> {
    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        ErrorMessage.Unauthorized,
        this.name);
    }
    const {email} = user;
    const currentUser = await this.userService.findByEmail(email);
    this.ok(res, fillDTO(UserRdo, currentUser));
  }

  public async uploadAvatar(req: Request, res: Response) {
    const {userId} = req.params;
    const updatedAvatar = { avatarUrl: req.file?.filename};
    await this.userService.updateById(userId, updatedAvatar);
    this.created(res, fillDTO(UploadAvatarRdo, updatedAvatar));
  }

}
