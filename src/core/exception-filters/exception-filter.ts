import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { ExceptionFilterInterface } from '../../types/core/exception-filter.interface.js';
import { LoggerInterface } from '../../types/core/logger.interface.js';
import { LoggerInfoMessage } from '../logger/logger.constants.js';
import HttpError from '../errors/http-error.js';
import { createErrorObject } from '../helpers/common.js';

@injectable()
export default class ExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info(LoggerInfoMessage.RegisterFilter);
  }

  private handleHttpError({detail, httpStatusCode, message}:HttpError, _req:Request, res:Response, _next:NextFunction){
    this.logger.error(`[${detail}]: ${httpStatusCode} - ${message}`);
    res
      .status(httpStatusCode)
      .json(createErrorObject(message));
  }

  private handleServerError({message}:Error, _req:Request, res:Response, _next:NextFunction){
    this.logger.error(message);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({error: message});
  }

  public catch(error: Error, req: Request, res: Response, next: NextFunction): void {
    if (error instanceof HttpError) {
      return this.handleHttpError(error, req, res, next);
    }
    this.handleServerError(error, req, res, next);
  }
}
