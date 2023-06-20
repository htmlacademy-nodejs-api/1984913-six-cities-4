import { inject, injectable } from 'inversify';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInterface } from '../../../types/core/logger.interface.js';
import { CommentServiceInterface } from './comment-service.interface.js';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import { ControllerRoute, EntityName, ObjectIdParam } from '../../../utils/constants.js';
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
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware.js';
import { ConfigSchema } from '../../../types/core/config-schema.type.js';
import { ConfigInterface } from '../../../types/core/config.interface.js';

@injectable()
export default class CommentController extends Controller {
  private readonly name = 'CommentController';
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface)
    protected readonly configService: ConfigInterface<ConfigSchema>,
    @inject(AppComponent.CommentServiceInterface)
    private readonly commentService: CommentServiceInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
  ) {
    super(logger, configService);

    this.logger.info(
      LoggerInfoMessage.RegisterRoute.concat(this.name)
    );

    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new ValidateDTOMiddleware(CreateCommentDTO),
        new DocumentExistsMiddleware(this.offerService, EntityName.Offer, ObjectIdParam.OfferId),
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityName.Offer, ObjectIdParam.OfferId),
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
      user,
      params,
    }: Request<ParamsOfferDetails, UnknownRecord, CreateCommentDTO>,
    res: Response
  ): Promise<void> {
    const offerId = params.offerId || '';
    const result = await this.commentService.create({ ...body, offerId, userId:user.id });
    await this.offerService.updateCommentCount(offerId);
    this.created(res, fillDTO(CommentRdo, result));
  }
}
