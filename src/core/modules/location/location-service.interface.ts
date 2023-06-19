import { DocumentType } from '@typegoose/typegoose';
import CreateLocationDto from './dto/create-location.dto.js';
import { LocationEntity } from './location.entity.js';

export interface LocationServiceInterface {
  create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>>;
  findByCity(city: string): Promise<DocumentType<LocationEntity> | null>;
}
