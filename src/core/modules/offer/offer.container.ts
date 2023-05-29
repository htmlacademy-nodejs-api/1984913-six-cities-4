import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import OfferService from './offer.service.js';
import { AppComponent } from '../../../types/app-component.enum.js';

export function createOfferContainer() {
  const container = new Container();
  container.bind<OfferServiceInterface>(AppComponent.OfferServiceInterface).to(OfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);

  return container;
}
