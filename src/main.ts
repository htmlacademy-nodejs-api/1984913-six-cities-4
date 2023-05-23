import { Container } from 'inversify';
import 'reflect-metadata';
import Application from './app/application.js';
import { AppComponent } from './utils/constants.js';
import { createApplicationContainer } from './app/application.container.js';
import { createUserContainer } from './core/modules/user/user.container.js';
import { createLocationContainer } from './core/modules/location/location.container.js';

async function bootstrap() {
  const container = Container.merge(createApplicationContainer(), createUserContainer(), createLocationContainer());

  const application = container.get<Application>(AppComponent.Application);
  await application.init();

}

bootstrap();
