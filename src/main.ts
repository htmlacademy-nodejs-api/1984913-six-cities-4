import Application from './app/application.js';
import PinoService from './core/logger/pino.service.js';

async function bootstrap(){
  const logger = new PinoService();
  const application = new Application(logger);
  await application.init();
}

bootstrap();
