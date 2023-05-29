import { inject, injectable } from 'inversify';
import { DocumentType, types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { OfferServiceInterface } from './offer-service.interface.js';
import { LoggerInterface } from '../../../types/core/logger.interface.js';
import CreateOfferDto from './dto/create-offer.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import { DEFAULT_OFFERS_AMOUNT, OfferRating, PREMIUM_OFFERS_AMOUNT } from './offer.constants.js';
import UpdateOfferDto from './dto/update-offer.js';
import { SORT_TYPE_DOWN } from '../../../utils/constants.js';

@injectable()
export default class OfferService implements OfferServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.OfferModel) private readonly offerModel: types.ModelType<OfferEntity>
  ) { }

  public async create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(LoggerInfoMessage.NewData.concat('offer'));

    return result;
  }

  public async updateById(offerId: string, dto: UpdateOfferDto): Promise<DocumentType<OfferEntity> | null> {
    const currentRating = this.countRating();
    return this.offerModel
      .findByIdAndUpdate(offerId, {...dto, rating:currentRating }, { new: true })
      .populate(['userId', 'locationId']).exec();
  }

  public async deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndDelete(offerId)
      .exec();
  }

  public async find(count?: number): Promise<DocumentType<OfferEntity>[]> {
    const limit = count ?? DEFAULT_OFFERS_AMOUNT;
    return this.offerModel.find({}, {}, { limit }).sort({createdAt:SORT_TYPE_DOWN}).populate(['userId', 'locationId']).exec();
  }

  public async findById(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    return this.offerModel.findById(offerId).populate(['userId', 'locationId']).exec();
  }

  public async findPremium(city: string): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ isPremium: true, city: city }, {}, { limit: PREMIUM_OFFERS_AMOUNT }).sort({createdAt:SORT_TYPE_DOWN}).populate(['userId', 'locationId']).exec();
  }

  public async findFavorite(): Promise<DocumentType<OfferEntity>[]> {
    return this.offerModel.find({ isFavorite: true }).populate(['userId', 'locationId']).exec();
  }

  public async updateFavoriteStatus(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const offer = this.offerModel.findById(offerId);
    return this.offerModel
      .findByIdAndUpdate(offerId, { isFavorite: !offer?.isFavorite }, { new: true }).populate(['userId', 'locationId']).exec();
  }

  public async updateCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null> {
    const currentRating = this.countRating();
    return this.offerModel
      .findByIdAndUpdate(offerId, {
        '$inc': {
          commentCount: 1,
        },
        'set':{
          rating:currentRating
        },
      }).exec();
  }

  public async countRating(): Promise<number | null > {
    const currentOfferWithRating = await this.offerModel
      .aggregate([
        {
          $lookup: {
            from: 'comments',
            let:{offerId:'$_id'},
            pipeline: [
              {$match:{ $expr: {$in: ['$$offerId','$offerId']}}},
              {$project: { rating: 1}},
              {$group:{_id:null, averageRating:{$avg:'rating'}}}
            ],
            as:'result'
          },
        },
        { $unwind: '$result' },
        { $addFields: { rating: '$result.averageRating' }},
        { $unset: 'result' },
      ]);
    return currentOfferWithRating[0] ? currentOfferWithRating[0].rating : OfferRating.Min;
  }

  public async exists(documentId: string): Promise<boolean> {
    return (await this.offerModel
      .exists({ _id: documentId })) !== null;
  }
}
