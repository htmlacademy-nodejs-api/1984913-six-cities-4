import { Response, Router } from 'express';
import { StatusCodes } from 'http-status-codes';
import { injectable } from 'inversify';
import { ControllerInterface } from '../../types/core/controller.interface';
import { LoggerInterface } from '../../types/core/logger.interface';
import { RouteInterface } from '../../types/router.interface';
import { LoggerInfoMessage } from '../logger/logger.constants';


@injectable()
export abstract class Controller implements ControllerInterface {
  private readonly _router: Router;

  constructor(
    protected readonly logger: LoggerInterface
  ) {
    this._router = Router();
  }

  get router() {
    return this._router;
  }

  public addRoute(route: RouteInterface) {
    this._router[route.method](route.path, route.handler.bind(this));
    const routeInfo = `${route.method.toUpperCase()} ${route.path}`;
    this.logger.info(LoggerInfoMessage.NewRoute.concat(routeInfo));
  }

  public send<T>(res: Response, statusCode: number, data: T): void {
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
