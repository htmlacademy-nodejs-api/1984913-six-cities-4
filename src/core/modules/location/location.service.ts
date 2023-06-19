import {DocumentType, types} from '@typegoose/typegoose';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../types/core/logger.interface.js';
import { LocationServiceInterface } from './location-service.interface.js';
import { LocationEntity } from './location.entity.js';
import CreateLocationDto from './dto/create-location.dto.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import { EntityName } from '../../../utils/constants.js';

@injectable()
export default class LocationService implements LocationServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger:LoggerInterface,
    @inject(AppComponent.LocationModel) private readonly locationModel:types.ModelType<LocationEntity>
  ){}

  public async create(dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const result = await this.locationModel.create(dto);
    this.logger.info(LoggerInfoMessage.NewData.concat(EntityName.Location));
    return result;
  }

  public async findByCity(city:string): Promise<DocumentType<LocationEntity>|null> {
    return this.locationModel.findOne({city:city}).exec();
  }

  public async findByCityOrCreate(city:string,dto: CreateLocationDto): Promise<DocumentType<LocationEntity>> {
    const existingLocation = await this.findByCity(city);

    if (existingLocation) {
      return existingLocation;
    }

    return this.create(dto);
  }
}
