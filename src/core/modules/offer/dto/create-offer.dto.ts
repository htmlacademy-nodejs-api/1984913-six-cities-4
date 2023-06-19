import { CityType, GoodType, HomeType, OfferDescriptionLength, OfferGuestsAmount, OfferPrice, OfferRating, OfferRoomsAmount, OfferTitleLength, } from '../offer.constants.js';
import { Length, IsInt, Min, Max, IsDateString, IsEnum, IsBoolean, IsArray, ArrayMinSize, } from 'class-validator';

export default class CreateOfferDto {
  @Length(OfferTitleLength.Min, OfferTitleLength.Max, {
    message: `Minimum title length must be ${OfferTitleLength.Min}, maximum ${OfferTitleLength.Max}`,
  })
  public title!: string;

  @Length(OfferDescriptionLength.Min, OfferDescriptionLength.Max, {
    message: `Minimum description length must be ${OfferDescriptionLength.Min}, maximum ${OfferDescriptionLength.Max}`,
  })
  public description!: string;

  @IsDateString({}, { message: 'postDate must be valid ISO date' })
  public postDate!: Date;

  @IsEnum(CityType, {
    message: `city must be one of ${Object.values(CityType).join(', ')}`,
  })
  public city!: CityType;

  @IsBoolean({ message: 'isPremium must be true or false' })
  public isPremium!: boolean;

  @IsBoolean({ message: 'isFavorite must be true or false' })
  public isFavorite!: boolean;

  @IsInt({ message: 'Rating must be an integer' })
  @Min(OfferRating.Default, { message: `Minimum rating is ${OfferRating.Default}` })
  @Max(OfferRating.Max, { message: `Maximum rating is ${OfferRating.Max}` })
  public rating!: number;

  @IsEnum(HomeType, {
    message: `type must be one of ${Object.values(HomeType).join(', ')}`,
  })
  public type!: HomeType;

  @IsInt({ message: 'Rooms must be an integer' })
  @Min(OfferRoomsAmount.Min, {
    message: `Minimum rooms is ${OfferRoomsAmount.Min}`,
  })
  @Max(OfferRoomsAmount.Max, {
    message: `Maximum rooms is ${OfferRoomsAmount.Max}`,
  })
  public rooms!: number;

  @IsInt({ message: 'Guests must be an integer' })
  @Min(OfferGuestsAmount.Min, {
    message: `Minimum guests is ${OfferGuestsAmount.Min}`,
  })
  @Max(OfferGuestsAmount.Max, {
    message: `Maximum guests is ${OfferGuestsAmount.Max}`,
  })
  public guests!: number;

  @IsInt({ message: 'Price must be an integer' })
  @Min(OfferPrice.Min, { message: `Minimum price is ${OfferPrice.Min}` })
  @Max(OfferPrice.Max, { message: `Maximum price is ${OfferPrice.Max}` })
  public price!: number;

  @IsArray({ message: 'Goods categories must be an array' })
  @ArrayMinSize(1)
  @IsEnum(GoodType, {
    each: true,
    message: `Goods must be an array of these elements ${Object.values(
      GoodType
    ).join(', ')}`,
  })
  public goods!: GoodType[];

  public userId!: string;

  public locationId!: string;
}
