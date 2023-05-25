import { DocumentType } from '@typegoose/typegoose';
import CreateOfferDto from './dto/create-offer.js';
import { OfferEntity } from './offer.entity';

export interface OfferServiceInterface {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
}
