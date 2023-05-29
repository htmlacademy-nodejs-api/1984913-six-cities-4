import { Container } from 'inversify';
import 'reflect-metadata';
import Application from './app/application.js';
import { createApplicationContainer } from './app/application.container.js';
import { createUserContainer } from './core/modules/user/user.container.js';
import { createLocationContainer } from './core/modules/location/location.container.js';
import { createOfferContainer } from './core/modules/offer/offer.container.js';
import { AppComponent } from './types/app-component.enum.js';
import { createCommentContainer } from './core/modules/comment/comment.container.js';

async function bootstrap() {
  const container = Container.merge(createApplicationContainer(), createUserContainer(), createLocationContainer(), createOfferContainer(), createCommentContainer());

  const application = container.get<Application>(AppComponent.Application);
  await application.init();

}

bootstrap();
