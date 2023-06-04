import { Expose } from 'class-transformer';
import { CityType, HomeType } from '../offer.constants.js';

export default class OfferMinRdo{
  @Expose()
  public id!: string;

  @Expose()
  public title!: string;

  @Expose()
  public postDate!: Date;

  @Expose()
  public city!: CityType;

  @Expose()
  public previewImage!: string;

  @Expose()
  public isPremium!: boolean;

  @Expose()
  public isFavorite!: boolean;

  @Expose()
  public rating!: number;

  @Expose()
  public type!: HomeType;

  @Expose()
  public price!: number;

  @Expose()
  public commentCount!: number;
}

