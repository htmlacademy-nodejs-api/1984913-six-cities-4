import { Container } from 'inversify';
import { AppComponent } from '../../../utils/constants.js';
import { types } from '@typegoose/typegoose';
import { LocationServiceInterface } from './location-service.interface.js';
import { LocationEntity, LocationModel } from './location.entity.js';
import LocationService from './location.service.js';

export function createLocationContainer() {
  const container = new Container();
  container.bind<LocationServiceInterface>(AppComponent.LocationServiceInterface).to(LocationService).inSingletonScope();
  container.bind<types.ModelType<LocationEntity>>(AppComponent.LocationModel).toConstantValue(LocationModel);

  return container;
}
