import { DocumentType } from '@typegoose/typegoose';
import CreateLocationDto from './dto/create-location.dto.js';
import { LocationEntity } from './location.entity.js';
import { LocationType } from '../../../types/offer.type.js';

export interface LocationServiceInterface {
  create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
  findByLocationId(locationId: string): Promise<DocumentType<LocationEntity> | null>;
  findByLocation(location: LocationType): Promise<DocumentType<LocationEntity> | null>;
  findByCity(city: string): Promise<DocumentType<LocationEntity> | null>;
  findByLocationOrCreate(location: LocationType, dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
}
