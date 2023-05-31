import { ConfigSchema } from '../core/config/config.schema';
import { getMongoURI } from '../core/helpers/db.js';
import { LoggerInfoMessage } from '../core/logger/logger.constants.js';
import { AppComponent } from '../types/app-component.enum.js';
import { ConfigInterface } from '../types/core/config.interface';
import { DatabaseClientInterface } from '../types/core/database-client.interface';
import { LoggerInterface } from '../types/core/logger.interface';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
@injectable()
export default class Application {
  private expressApplication: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface
  ) {
    this.expressApplication = express();
  }

  private async _initDb() {
    this.logger.info(LoggerInfoMessage.InitDb);
    const uri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );
    await this.databaseClient.connect(uri);
    this.logger.info(LoggerInfoMessage.InitDbDone);
  }

  private async _initServer() {
    this.logger.info(LoggerInfoMessage.InitServer);

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    const pathName = `http://localhost:${port}`;
    this.logger.info(LoggerInfoMessage.InitServerDone.concat(pathName));
  }

  private async _initController() {
    this.logger.info(LoggerInfoMessage.InitController);


    this.logger.info(LoggerInfoMessage.InitControllerDone);
  }

  public async init() {
    this.logger.info(LoggerInfoMessage.InitApp);
    await this._initDb();
    await this._initServer();
    await this._initController();
  }
}
