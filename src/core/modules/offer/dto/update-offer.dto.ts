import { CityType, DEFAULT_IMAGES_AMOUNT, GoodType, HomeType, OfferDescriptionLength, OfferGuestsAmount, OfferPrice, OfferRoomsAmount, OfferTitleLength,} from '../offer.constants.js';
import {
  Length, MaxLength, IsInt, Min, Max, IsDateString, IsEnum, IsBoolean, IsArray, ArrayMinSize, ArrayMaxSize, IsOptional,} from 'class-validator';
export default class UpdateOfferDto {
  @IsOptional()
  @Length(OfferTitleLength.Min, OfferTitleLength.Max, {
    message: `Minimum title length must be ${OfferTitleLength.Min}, maximum ${OfferTitleLength.Max}`,
  })
  public title?: string;

  @IsOptional()
  @Length(OfferDescriptionLength.Min, OfferDescriptionLength.Max, {
    message: `Minimum description length must be ${OfferDescriptionLength.Min}, maximum ${OfferDescriptionLength.Max}`,
  })
  public description?: string;

  @IsOptional()
  @IsDateString({}, { message: 'postDate must be valid ISO date' })
  public postDate?: Date;

  @IsOptional()
  @IsEnum(CityType, {
    message: `city must be one of ${Object.values(CityType).join(', ')}`,
  })
  public city?: CityType;

  @IsOptional()
  @MaxLength(256, { message: 'Too short for field previewImage' })
  public previewImage?: string;

  @IsOptional()
  @IsArray({ message: 'Field images must be an array' })
  @ArrayMinSize(DEFAULT_IMAGES_AMOUNT)
  @ArrayMaxSize(DEFAULT_IMAGES_AMOUNT)
  public images?: string[];

  @IsOptional()
  @IsBoolean({ message: 'isPremium must be true or false' })
  public isPremium?: boolean;

  @IsOptional()
  @IsBoolean({ message: 'isFavorite must be true or false' })
  public isFavorite?: boolean;

  @IsOptional()
  @IsEnum(HomeType, {
    message: `type must be one of ${Object.values(HomeType).join(', ')}`,
  })
  public type?: HomeType;

  @IsOptional()
  @IsInt({ message: 'Rooms must be an integer' })
  @Min(OfferRoomsAmount.Min, {
    message: `Minimum rooms is ${OfferRoomsAmount.Min}`,
  })
  @Max(OfferRoomsAmount.Max, {
    message: `Maximum rooms is ${OfferRoomsAmount.Max}`,
  })
  public rooms?: number;

  @IsOptional()
  @IsInt({ message: 'Guests must be an integer' })
  @Min(OfferGuestsAmount.Min, {
    message: `Minimum guests is ${OfferGuestsAmount.Min}`,
  })
  @Max(OfferGuestsAmount.Max, {
    message: `Maximum guests is ${OfferGuestsAmount.Max}`,
  })
  public guests?: number;

  @IsOptional()
  @IsInt({ message: 'Price must be an integer' })
  @Min(OfferPrice.Min, { message: `Minimum price is ${OfferPrice.Min}` })
  @Max(OfferPrice.Max, { message: `Maximum price is ${OfferPrice.Max}` })
  public price?: number;

  @IsOptional()
  @IsArray({ message: 'Goods categories must be an array' })
  @ArrayMinSize(1)
  @IsEnum(GoodType, {
    each: true,
    message: `Goods must be an array of these elements ${Object.values(
      GoodType
    ).join(', ')}`,
  })
  public goods?: GoodType[];

}
