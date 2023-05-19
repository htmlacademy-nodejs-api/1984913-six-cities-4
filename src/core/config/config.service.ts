import { ConfigInterface } from '../../types/core/config.interface.js';
import { LoggerInterface } from '../../types/core/logger.interface.js';
import { config } from 'dotenv';
import { ErrorMessage, LoggerInfoMessage } from '../../utils/constants.js';
import { ConfigSchema, configSchema } from './config.schema.js';

export default class ConfigService implements ConfigInterface<ConfigSchema> {
  private readonly config: ConfigSchema;
  constructor(
    private readonly logger:LoggerInterface
  ) {
    const parsedOutput = config();
    if(parsedOutput.error){
      throw new Error(ErrorMessage.Config);
    }
    configSchema.load({});
    configSchema.validate({ allowed: 'strict', output: this.logger.info });
    this.config = configSchema.getProperties();
    this.logger.info(LoggerInfoMessage.Config);
  }

  public get<T extends keyof ConfigSchema>(key:T):ConfigSchema[T] {
    return this.config[key];
  }
}
