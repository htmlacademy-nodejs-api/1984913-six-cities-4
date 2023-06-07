import { inject, injectable } from 'inversify';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../types/core/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import { ControllerRoute } from '../../../utils/constants.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { Controller } from '../../controller/controller.abstract.js';
import CreateCommentDTO from './dto/create-comment.dto.js';
import { UnknownRecord } from '../../../types/unknown-record.type.js';
import { Request, Response } from 'express';
import CommentRdo from './rdo/comment.rdo.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferServiceInterface } from '../offer/offer-service.interface.js';
import { ParamsOfferDetails } from '../../../types/params-details.type.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { ValidateDTOMiddleware } from '../../middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../middleware/document-exists.middleware.js';

@injectable()
export default class CommentController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info(
      LoggerInfoMessage.RegisterRoute.concat('CommentController')
    );

    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(CreateCommentDTO),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new DocumentExistsMiddleware(this.offerService, 'offer', 'offerId'),
      ],
    });
  }

  public async index(
    { params }: Request<ParamsOfferDetails, UnknownRecord>,
    res: Response
  ): Promise<void> {
    const offerId = params.offerId || '';
    const result = await this.commentService.findByOfferId(offerId);
    this.created(res, fillDTO(CommentRdo, result));
  }

  public async create(
    {
      body,
      params,
    }: Request<ParamsOfferDetails, UnknownRecord, CreateCommentDTO>,
    res: Response
  ): Promise<void> {
    const offerId = params.offerId || '';
    const result = await this.commentService.create({ ...body, offerId });
    await this.offerService.updateCommentCount(offerId);
    this.created(res, fillDTO(CommentRdo, result));
  }
}
