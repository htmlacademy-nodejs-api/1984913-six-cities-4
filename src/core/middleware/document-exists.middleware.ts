import { StatusCodes } from 'http-status-codes';
import { NextFunction, Request, Response } from 'express';
import HttpError from '../errors/http-error.js';
import { DocumentExistsInterface } from '../../types/core/document-exists.interface.js';
import { MiddlewareInterface } from '../../types/core/middleware.interface.js';
import { MiddlewareName } from '../../utils/constants.js';

export class DocumentExistsMiddleware implements MiddlewareInterface {
  constructor(
    private readonly service: DocumentExistsInterface,
    private readonly entityName: string,
    private readonly paramName: string,
  ) {}

  public async execute({params}: Request, _res: Response, next: NextFunction): Promise<void> {
    const documentId = params[this.paramName];
    if (!await this.service.exists(documentId)) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `${this.entityName} with ${documentId} not found.`,
        MiddlewareName.DocumentExists
      );
    }

    next();
  }
}
