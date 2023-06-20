import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../../types/core/middleware.interface.js';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { transformErrors } from '../helpers/common.js';
import ValidationError from '../errors/validation-error.js';


export class ValidateDTOMiddleware implements MiddlewareInterface {
  constructor(private dto: ClassConstructor<object>) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const {body} = req;
    const dtoInstance = plainToInstance(this.dto, body);
    const errors = await validate(dtoInstance, { validationError: { target: false }});

    if (errors.length > 0) {
      throw new ValidationError(`Validation error: "${req.path}"`, transformErrors(errors));
    }

    next();
  }
}
