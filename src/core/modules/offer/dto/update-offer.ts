import { CityType, GoodType, HomeType} from '../offer.constants.js';


export default class UpdateOfferDto{
  public title?: string;
  public description?: string;
  public postDate?: Date;
  public city?: CityType;
  public previewImage?: string;
  public images?: string[];
  public isPremium?: boolean;
  public isFavorite?: boolean;
  public rating?: number;
  public type?: HomeType;
  public rooms?: number;
  public guests?: number;
  public price?: number;
  public goods?: GoodType[];
  public locationId?: string;
}
