import { Request, Response, NextFunction } from 'express';
import { inject, injectable } from 'inversify';
import { AppComponent } from '../../types/app-component.enum.js';
import { createErrorObject } from '../helpers/index.js';
import HttpError from '../errors/http-error.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { ExceptionFilterInterface } from '../../types/core/exception-filter.interface.js';
import { LoggerInterface } from '../../types/core/logger.interface.js';
import { LoggerInfoMessage } from '../logger/logger.constants.js';
import { ExceptionFilterName } from '../../utils/constants.js';

@injectable()
export default class HttpErrorExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info(LoggerInfoMessage.RegisterFilter.concat(ExceptionFilterName.Http));
  }

  public catch(error: unknown, req: Request, res: Response, next: NextFunction): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(`[${ExceptionFilterName.Http}]: ${req.path} # ${error.message}`);

    res
      .status(error.httpStatusCode)
      .json(createErrorObject(ServiceError.CommonError, error.message));
  }
}
