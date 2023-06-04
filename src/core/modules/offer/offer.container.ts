import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { OfferServiceInterface } from './offer-service.interface.js';
import { OfferEntity, OfferModel } from './offer.entity.js';
import OfferService from './offer.service.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { ControllerInterface } from '../../../types/core/controller.interface.js';
import OfferController from './offer.controller.js';

export function createOfferContainer() {
  const container = new Container();
  container.bind<OfferServiceInterface>(AppComponent.OfferServiceInterface).to(OfferService).inSingletonScope();
  container.bind<types.ModelType<OfferEntity>>(AppComponent.OfferModel).toConstantValue(OfferModel);
  container.bind<ControllerInterface>(AppComponent.OfferController).to(OfferController).inSingletonScope();

  return container;
}
