import { LoggerInterface } from '../types/core/logger.interface';

export default class Application {
  constructor(
    private readonly logger: LoggerInterface
  ) {}

  public async init() {
    this.logger.info('Application initialization...');
  }
}
