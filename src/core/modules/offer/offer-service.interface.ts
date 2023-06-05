import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.js';
import { OfferEntity } from './offer.entity';
import UpdateOfferDto from './dto/update-offer.js';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  updateById(offerId: string, dto:UpdateOfferDto): Promise<DocumentType<OfferEntity> | null>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?:number): Promise<DocumentType<OfferEntity>[]>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  findPremium(city:string): Promise<DocumentType<OfferEntity>[]>;
  findFavorite():Promise<DocumentType<OfferEntity>[]>;
  updateFavoriteStatus(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateCommentCount(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  countRating(offerId: string): Promise<number | null >;
  exists(documentId: string): Promise<boolean>;
}
