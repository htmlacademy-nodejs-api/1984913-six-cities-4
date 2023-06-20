import { nanoid } from 'nanoid';
import multer, { diskStorage } from 'multer';
import { extension } from 'mime-types';
import { NextFunction, Request, Response } from 'express';
import { MiddlewareInterface } from '../../types/core/middleware.interface';
import { ImageFieldName } from '../../utils/constants.js';
import { DEFAULT_IMAGES_AMOUNT } from '../modules/offer/offer.constants.js';

export class UploadFileMiddleware implements MiddlewareInterface {
  constructor(
    private uploadDirectory: string,
    private fieldName: string,
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const storage = diskStorage({
      destination: this.uploadDirectory,
      filename: (_req, file, callback) => {
        let error:Error|null = null;
        const fileExtentions = extension(file.mimetype);
        if(!fileExtentions){
          error = new Error ('Wrong file mimetype');
        }
        const filename = nanoid();
        callback(error, `${filename}.${fileExtentions}`);
      }
    });

    if(this.fieldName !== ImageFieldName.Image){
      const uploadSingleFileMiddleware = multer({storage}).single(this.fieldName);
      uploadSingleFileMiddleware(req, res, next);
    }else{
      const uploadArrayFilesMiddleware = multer({storage}).array(this.fieldName, DEFAULT_IMAGES_AMOUNT);
      uploadArrayFilesMiddleware(req, res, next);
    }
  }
}
