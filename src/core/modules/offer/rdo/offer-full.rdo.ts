import { Expose, Type } from 'class-transformer';
import { CityType, GoodType, HomeType } from '../offer.constants.js';
import UserRdo from '../../user/rdo/user.rdo.js';
import LocationRdo from '../../location/rdo/location.rdo.js';

export default class OfferFullRdo{
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public description!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: CityType;

  @Expose()
  public previewImage!: string;

  @Expose()
  public images!: string[];

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: HomeType;

  @Expose()
  public rooms!: number;

  @Expose()
  public guests!: number;

  @Expose()
  public price!: number;

  @Expose()
  public goods!: GoodType[];

  @Expose({ name: 'locationId'})
  @Type(()=>LocationRdo)
  public location!: LocationRdo;

  @Expose({ name: 'userId'})
  @Type(()=>UserRdo)
  public user!: UserRdo;

  @Expose()
  public commentCount!: number;
}
