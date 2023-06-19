import { CityType } from '../../types/city-type.enum.js';
import { GoodType } from '../../types/good-type.enum.js';
import { HomeType } from '../../types/home-type.enum.js';
import CreateLocationDto from '../location/create-location.dto.js';
import UserDto from '../user/user.dto';

export default class OfferDto{
  public id!: string;

  public title!: string;

  public description!: string;

  public postDate!: string;

  public city!: CityType;

  public previewImage!: string;

  public images!: string[];

  public isPremium!: boolean;

  public isFavorite!: boolean;

  public rating!: number;

  public type!: HomeType;

  public rooms!: number;

  public guests!: number;

  public price!: number;

  public goods!: GoodType[];

  public location!: CreateLocationDto;

  public user!: UserDto;

}
