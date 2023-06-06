import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import { Controller } from '../../controller/controller.abstract.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { HttpMethod } from '../../../types/http-method.enum.js';
import { LoggerInterface } from '../../../types/core/logger.interface';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import { OfferServiceInterface } from './offer-service.interface';
import { fillDTO } from '../../helpers/common.js';
import OfferMinRdo from './rdo/offer-min.rdo.js';
import CreateOfferDto from './dto/create-offer.js';
import OfferFullRdo from './rdo/offer-full.rdo.js';
import HttpError from '../../errors/http-error.js';
import { StatusCodes } from 'http-status-codes';
import UpdateOfferDto from './dto/update-offer.js';
import { ControllerRoute } from '../../../utils/constants.js';
import {
  RequestQueryLimit,
  RequestQueryPremium,
  RequestQueryStatus,
} from '../../../types/request-query.type.js';
import { UnknownRecord } from '../../../types/unknown-record.type.js';
import { ParamsOfferDetails } from '../../../types/params-details.type.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { ValidateDTOMiddleware } from '../../middleware/validate-dto.middleware.js';

@injectable()
export default class OfferController extends Controller {
  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface
  ) {
    super(logger);

    this.logger.info(LoggerInfoMessage.RegisterRoute.concat('OfferController'));

    this.addRoute({
      path: ControllerRoute.Main,
      method: HttpMethod.Get,
      handler: this.index,
    });
    this.addRoute({
      path: ControllerRoute.Main,
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [
        new ValidateDTOMiddleware(CreateOfferDto),
      ],
    });
    this.addRoute({
      path: ControllerRoute.Premium,
      method: HttpMethod.Get,
      handler: this.showPremium,
    });
    this.addRoute({
      path: ControllerRoute.Favorite,
      method: HttpMethod.Get,
      handler: this.showFavorite,
    });
    this.addRoute({
      path: `${ControllerRoute.Favorite}${ControllerRoute.Offer}`,
      method: HttpMethod.Patch,
      handler: this.changeFavorite,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Get,
      handler: this.showOffer,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new ValidateObjectIdMiddleware('offerId'),
        new ValidateDTOMiddleware(UpdateOfferDto),
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [new ValidateObjectIdMiddleware('offerId')],
    });
  }

  public async index(
    {
      query,
    }: Request<UnknownRecord, UnknownRecord, UnknownRecord, RequestQueryLimit>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(query.limit);
    const offersToResponse = fillDTO(OfferMinRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async create(
    { body }: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferFullRdo, offer));
  }

  public async showPremium(
    {
      query,
    }: Request<
      UnknownRecord,
      UnknownRecord,
      UnknownRecord,
      RequestQueryPremium
    >,
    res: Response
  ): Promise<void> {
    const city = query.city ? query.city : ' ';
    const offers = await this.offerService.findPremium(city);
    if (!offers) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Premium offer with city ${query.city} not found.`,
        'OfferController'
      );
    }
    const offersToResponse = fillDTO(OfferMinRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async showFavorite(_req: Request, res: Response): Promise<void> {
    const offers = await this.offerService.findFavorite();
    const offersToResponse = fillDTO(OfferMinRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async showOffer(
    { params }: Request<ParamsOfferDetails>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    this.ok(res, fillDTO(OfferFullRdo, offer));
  }

  public async update(
    {
      body,
      params,
    }: Request<ParamsOfferDetails, UnknownRecord, UpdateOfferDto>,
    res: Response
  ): Promise<void> {
    const updatedOffer = await this.offerService.updateById(
      params.offerId,
      body
    );

    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${params.offerId} not found.`,
        'OfferController'
      );
    }

    this.ok(res, fillDTO(OfferFullRdo, updatedOffer));
  }

  public async delete(
    { params }: Request<ParamsOfferDetails>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }

    this.noContent(res, offer);
  }

  public async changeFavorite(
    {
      params,
      query,
    }: Request<
      ParamsOfferDetails,
      UnknownRecord,
      UnknownRecord,
      RequestQueryStatus
    >,
    res: Response
  ) {
    const { offerId } = params;
    const { status } = query;
    const offer = await this.offerService.findById(offerId);
    if (!offer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    if (!status) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'There is no status query (true or false)',
        'OfferController'
      );
    }

    if (JSON.parse(status) === offer.isFavorite) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Offer with id ${offerId} has the same status`,
        'OfferController'
      );
    }

    const updatedOffer = await this.offerService.updateFavoriteStatus(offerId);
    if (!updatedOffer) {
      throw new HttpError(
        StatusCodes.NOT_FOUND,
        `Offer with id ${offerId} not found.`,
        'OfferController'
      );
    }
    this.ok(res, fillDTO(OfferFullRdo, updatedOffer));
  }
}
