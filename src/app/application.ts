import { ConfigSchema } from '../core/config/config.schema';
import { ConfigInterface } from '../types/core/config.interface';
import { LoggerInterface } from '../types/core/logger.interface';
import { AppComponent, LoggerInfoMessage } from '../utils/constants.js';
import { inject, injectable } from 'inversify';

@injectable()
export default class Application {
  constructor(
   @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
   @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>
  ) {}

  public async init() {
    this.logger.info(LoggerInfoMessage.Initialization);
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
