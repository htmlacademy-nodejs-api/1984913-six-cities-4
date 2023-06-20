import { CityType } from '../../types/city-type.enum.js';
import { GoodType } from '../../types/good-type.enum.js';
import { HomeType } from '../../types/home-type.enum.js';
import { Location } from '../../types/types.js';

export default class CreateOfferDto {
  public title!: string;

  public description!: string;

  public postDate!: string;

  public city!: CityType;

  public previewImage?: string;

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: HomeType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public goods!: GoodType[];

  public images?: string[];

  public location!: Location;
}
