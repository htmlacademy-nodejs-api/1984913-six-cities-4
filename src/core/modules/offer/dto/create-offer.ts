import { CityType, GoodType, HomeType} from '../../../../utils/constants.js';


export default class CreateOfferDto{
  public title!: string;
  public description!: string;
  public postDate!: Date;
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
  public userId!:string;
  public locationId!: string;
}
