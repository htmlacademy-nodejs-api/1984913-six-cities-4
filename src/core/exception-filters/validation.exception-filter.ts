import { inject, injectable } from 'inversify';
import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import { AppComponent } from '../../types/app-component.enum.js';
import ValidationError from '../errors/validation-error.js';
import { createErrorObject } from '../helpers/index.js';
import { ExceptionFilterInterface } from '../../types/core/exception-filter.interface.js';
import { LoggerInterface } from '../../types/core/logger.interface.js';
import { ServiceError } from '../../types/service-error.enum.js';
import { LoggerInfoMessage } from '../logger/logger.constants.js';
import { ExceptionFilterName } from '../../utils/constants.js';

@injectable()
export default class ValidationExceptionFilter implements ExceptionFilterInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface
  ) {
    this.logger.info(LoggerInfoMessage.RegisterFilter.concat(ExceptionFilterName.Validation));
  }

  public catch(error: unknown, _req: Request, res: Response, next: NextFunction): void {
    if (! (error instanceof ValidationError)) {
      return next(error);
    }

    this.logger.error(`[${ExceptionFilterName.Validation}]: ${error.message}`);

    error.details.forEach(
      (errorField) => this.logger.error(`[${errorField.property}] - ${errorField.messages}`)
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ServiceError.ValidationError, error.message, error.details));
  }
}
