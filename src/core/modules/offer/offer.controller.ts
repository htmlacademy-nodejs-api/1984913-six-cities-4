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
import { ControllerRoute, EntityName, ErrorMessage, ImageFieldName, ObjectIdParam } from '../../../utils/constants.js';
import { RequestQueryLimit, RequestQueryPremium, RequestQueryStatus,} from '../../../types/request-query.type.js';
import { UnknownRecord } from '../../../types/unknown-record.type.js';
import { ParamsOfferDetails } from '../../../types/params-details.type.js';
import { ValidateObjectIdMiddleware } from '../../middleware/validate-objectid.middleware.js';
import { ValidateDTOMiddleware } from '../../middleware/validate-dto.middleware.js';
import { DocumentExistsMiddleware } from '../../middleware/document-exists.middleware.js';
import { PrivateRouteMiddleware } from '../../middleware/private-route.middleware.js';
import { UserServiceInterface } from '../user/user-service.interface.js';
import { ConfigInterface } from '../../../types/core/config.interface.js';
import { ConfigSchema } from '../../../types/core/config-schema.type.js';
import { UploadFileMiddleware } from '../../middleware/upload-file.middleware.js';
import UploadPreviewRdo from './rdo/upload-preview.rdo.js';
import UploadImagesRdo from './rdo/upload-images.rdo.js';

@injectable()
export default class OfferController extends Controller {
  private readonly name = AppComponent.OfferController.description;

  constructor(
    @inject(AppComponent.LoggerInterface)
    protected readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface)
    protected readonly configService: ConfigInterface<ConfigSchema>,
    @inject(AppComponent.OfferServiceInterface)
    private readonly offerService: OfferServiceInterface,
    @inject(AppComponent.UserServiceInterface)
    private readonly userService: UserServiceInterface
  ) {
    super(logger, configService);

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
        new PrivateRouteMiddleware(),
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
      middlewares: [
        new PrivateRouteMiddleware()
      ],
    });
    this.addRoute({
      path: `${ControllerRoute.Favorite}${ControllerRoute.Offer}`,
      method: HttpMethod.Post,
      handler: this.changeFavorite,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityName.Offer, ObjectIdParam.OfferId)
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Get,
      handler: this.showOffer,
      middlewares: [
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityName.Offer, ObjectIdParam.OfferId)
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Patch,
      handler: this.update,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new ValidateDTOMiddleware(UpdateOfferDto),
        new DocumentExistsMiddleware(this.offerService, EntityName.Offer, ObjectIdParam.OfferId)
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer.concat('/', ImageFieldName.Preview),
      method: HttpMethod.Post,
      handler: this.uploadPreview,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), ImageFieldName.Preview)
      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer.concat('/', ImageFieldName.Image),
      method: HttpMethod.Post,
      handler: this.uploadImages,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new UploadFileMiddleware(this.configService.get('UPLOAD_DIRECTORY'), ImageFieldName.Image)

      ],
    });
    this.addRoute({
      path: ControllerRoute.Offer,
      method: HttpMethod.Delete,
      handler: this.delete,
      middlewares: [
        new PrivateRouteMiddleware(),
        new ValidateObjectIdMiddleware(ObjectIdParam.OfferId),
        new DocumentExistsMiddleware(this.offerService, EntityName.Offer, ObjectIdParam.OfferId)
      ],
    });
  }

  public async index(
    {user,
      query,
    }: Request<UnknownRecord, UnknownRecord, UnknownRecord, RequestQueryLimit>,
    res: Response
  ): Promise<void> {
    const offers = await this.offerService.find(query.limit);
    if(!user){
      offers.map((offer)=>{
        offer.isFavorite = false;
      });
    }
    const offersToResponse = fillDTO(OfferMinRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async create(
    { user, body}: Request<UnknownRecord, UnknownRecord, CreateOfferDto>,
    res: Response
  ): Promise<void> {
    const result = await this.offerService.create({...body, userId:user.id});
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
        this.name
      );
    }
    const offersToResponse = fillDTO(OfferMinRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async showFavorite({user}: Request, res: Response): Promise<void> {
    if(!user){
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.Unauthorized,
        this.name
      );
    }
    const favoriteList = await this.userService.getFavoriteListInfo(user.id);
    if(!favoriteList){
      throw new HttpError(
        StatusCodes.NO_CONTENT,
        ErrorMessage.NoContent,
        this.name
      );
    }
    const offers = await this.offerService.findFavorite(favoriteList);
    offers?.map((offer)=>{
      offer.isFavorite = true;
    });

    const offersToResponse = fillDTO(OfferMinRdo, offers);
    this.ok(res, offersToResponse);
  }

  public async showOffer(
    {user, params }: Request<ParamsOfferDetails>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.findById(offerId);
    if(!user && offer){
      offer.isFavorite = false;
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
    this.ok(res, fillDTO(OfferFullRdo, updatedOffer));
  }

  public async delete(
    {user, params }: Request<ParamsOfferDetails>,
    res: Response
  ): Promise<void> {
    const { offerId } = params;
    if(!user){
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.Unauthorized,
        this.name
      );
    }
    const offer = await this.offerService.deleteById(offerId);
    await this.userService.removeFromFavoriteList(user.id, offerId);
    this.noContent(res, offer);
  }

  public async changeFavorite(
    { user,
      params,
      query,
    }: Request<
      ParamsOfferDetails,
      UnknownRecord,
      UnknownRecord,
      RequestQueryStatus
    >,
    _res: Response
  ) {
    const { offerId } = params;
    const { status } = query;

    if (!status) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.NoStatus,
        this.name
      );
    }

    if(!user){
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        ErrorMessage.Unauthorized,
        this.name
      );
    }

    if(JSON.parse(status)){
      await this.userService.addToFavoriteList(user.id, offerId);
    }else{
      await this.userService.removeFromFavoriteList(user.id, offerId);
    }
  }

  public async uploadPreview(req: Request<ParamsOfferDetails>, res: Response) {
    const {offerId} = req.params;
    const updatedPreview = { previewImage: req.file?.filename };

    await this.offerService.updateById(offerId, updatedPreview);
    this.created(res, fillDTO(UploadPreviewRdo, {updatedPreview}));
  }

  public async uploadImages(req: Request<ParamsOfferDetails>, res: Response) {
    const {offerId} = req.params;
    const fileArray = req.files as Array<Express.Multer.File>;
    const fileNames = fileArray.map((file) => file.filename);

    const updatedImages = { images: fileNames};

    await this.offerService.updateById(offerId, updatedImages);
    this.created(res, fillDTO(UploadImagesRdo, updatedImages));
  }
}
