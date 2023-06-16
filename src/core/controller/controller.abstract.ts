import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { ControllerInterface } from '../../types/core/controller.interface';
import { LoggerInterface } from '../../types/core/logger.interface';
import { RouteInterface } from '../../types/core/route.interface';
import { LoggerInfoMessage } from '../logger/logger.constants.js';
import asyncHandler from 'express-async-handler';
import { ConfigInterface } from '../../types/core/config.interface';
import { ConfigSchema } from '../../types/core/config-schema.type.js';
import { UnknownRecord } from '../../types/unknown-record.type.js';
import { transformObject } from '../helpers/transform-object.js';
import { STATIC_RESOURCE_FIELDS } from '../../utils/constants.js';
import { getFullServerPath } from '../helpers/common.js';

@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface,
    protected readonly configService: ConfigInterface<ConfigSchema>
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    const routeHandler = asyncHandler(route.handler.bind(this));
    const middlewares = route.middlewares?.map((middleware)=>asyncHandler(middleware.execute.bind(middleware)));
    const allHandlers = middlewares ? [...middlewares, routeHandler] : routeHandler;
    this._router[route.method](route.path, allHandlers);
    const routeInfo = `${route.method.toUpperCase()} ${route.path}`;
    this.logger.info(LoggerInfoMessage.NewRoute.concat(routeInfo));
  }

  protected addStaticPath(data: UnknownRecord): void {
    const fullServerPath = getFullServerPath(this.configService.get('HOST'), this.configService.get('PORT'));
    transformObject(
      STATIC_RESOURCE_FIELDS,
      `${fullServerPath}/${this.configService.get('STATIC_DIRECTORY')}`,
      `${fullServerPath}/${this.configService.get('UPLOAD_DIRECTORY')}`,
      data
    );
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
    this.addStaticPath(data as UnknownRecord);
    res
      .type('application/json')
      .status(statusCode)
      .json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
