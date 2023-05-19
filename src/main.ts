import { Container } from 'inversify';
import 'reflect-metadata';
import Application from './app/application.js';
import { AppComponent } from './utils/constants.js';
import { LoggerInterface } from './types/core/logger.interface.js';
import { ConfigInterface } from './types/core/config.interface.js';
import { ConfigSchema } from './core/config/config.schema.js';
import PinoService from './core/logger/pino.service.js';
import ConfigService from './core/config/config.service.js';

async function bootstrap(){
  const container = new Container();
  container.bind<Application>(AppComponent.Application).to(Application).inSingletonScope();
  container.bind<LoggerInterface>(AppComponent.LoggerInterface).to(PinoService).inSingletonScope();
  container.bind<ConfigInterface<ConfigSchema>>(AppComponent.ConfigInterface).to(ConfigService).inSingletonScope();

  const application = container.get<Application>(AppComponent.Application);
  await application.init();

}

bootstrap();
