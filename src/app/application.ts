import { ConfigSchema } from '../core/config/config.schema';
import { ConfigInterface } from '../types/core/config.interface';
import { LoggerInterface } from '../types/core/logger.interface';
import { LoggerInfoMessage } from '../utils/constants.js';

export default class Application {
  constructor(
    private readonly logger: LoggerInterface,
    private readonly config: ConfigInterface<ConfigSchema>
  ) {}

  public async init() {
    this.logger.info(LoggerInfoMessage.Initialization);
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);
  }
}
