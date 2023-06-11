import { NextFunction, Request, Response } from 'express';
import { jwtVerify } from 'jose';
import { StatusCodes } from 'http-status-codes';
import { createSecretKey } from 'node:crypto';
import HttpError from '../errors/http-error.js';
import { MiddlewareInterface } from '../../types/core/middleware.interface.js';
import { TokenPayload } from '../../types/token-payload.type.js';
import { ErrorMessage, MiddlewareName } from '../../utils/constants.js';

export class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(private readonly jwtSecret: string) {}

  public async execute(req: Request, _res: Response, next: NextFunction): Promise<void> {
    const authorizationHeader = req.headers?.authorization?.split(' ');
    if (!authorizationHeader) {
      return next();
    }

    const [, token] = authorizationHeader;

    try {
      const { payload } = await jwtVerify(
        token,
        createSecretKey(this.jwtSecret, 'utf-8')
      );

      req.user = { email: payload.email, id: payload.id } as TokenPayload;
      return next();
    } catch {

      return next(new HttpError(
        StatusCodes.UNAUTHORIZED,
        ErrorMessage.InvalidToken,
        MiddlewareName.Authenticate)
      );
    }
  }
}
