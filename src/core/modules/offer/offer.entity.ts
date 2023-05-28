import typegoose, {
  getModelForClass,
  defaultClasses, Ref
} from '@typegoose/typegoose';
import { CityType, GoodType, HomeType, OfferRating, DEFAULT_COMMENTS_AMOUNT } from './offer.constants.js';
import { UserEntity } from '../user/user.entity.js';
import { LocationEntity } from '../location/location.entity.js';

const { prop, modelOptions } = typegoose;

export interface OfferEntity extends defaultClasses.Base { }

@modelOptions({
  schemaOptions: {
    collection: 'offers',
  },
})
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ required: true, trim: true })
  public title!: string;

  @prop({ required: true, trim: true })
  public description!: string;

  @prop()
  public postDate!: Date;

  @prop({required: true,
    city: () => String,
    enum: CityType,
  })
  public city!: CityType;

  @prop({ required: true,})
  public previewImage!: string;

  @prop({required: true, type:String})
  public images!: string[];

  @prop({required: true,})
  public isPremium!: boolean;

  @prop({required: true,})
  public isFavorite!: boolean;

  @prop({required: true, default: OfferRating.Min})
  public rating!: number;

  @prop({
    required: true,
    type: () => String,
    enum: HomeType,
  })
  public type!: HomeType;

  @prop({required: true,})
  public rooms!: number;

  @prop({required: true,})
  public guests!: number;

  @prop({required: true,})
  public price!: number;

  @prop({ required: true,type:String, enum: GoodType })
  public goods!: GoodType[];

  @prop({
    ref: LocationEntity,
    required: true
  })
  public locationId!: Ref<LocationEntity>;

  @prop({
    ref: UserEntity,
    required: true
  })
  public userId!: Ref<UserEntity>;

  @prop({ default: DEFAULT_COMMENTS_AMOUNT })
  public commentCount!: number;
}

export const OfferModel = getModelForClass(OfferEntity);
