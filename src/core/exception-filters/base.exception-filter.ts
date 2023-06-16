import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import { createErrorObject } from '../helpers/index.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { ExceptionFilterInterface } from '../../types/core/exception-filter.interface.js';
import { LoggerInterface } from '../../types/core/logger.interface.js';
import { LoggerInfoMessage } from '../logger/logger.constants.js';
import { ExceptionFilterName } from '../../utils/constants.js';

@injectable()
export default class BaseExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info(LoggerInfoMessage.RegisterFilter.concat(ExceptionFilterName.Base));
  }

  public catch(error: Error, _req: Request, res: Response, _next: NextFunction) {
    this.logger.error(`[${ExceptionFilterName.Base}]: ${error.message}`);

    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(createErrorObject(ServiceError.ServiceError, error.message));
  }
}
