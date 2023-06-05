import { ConfigSchema } from '../core/config/config.schema';
import { getMongoURI } from '../core/helpers/db.js';
import { LoggerInfoMessage } from '../core/logger/logger.constants.js';
import { AppComponent } from '../types/app-component.enum.js';
import { ConfigInterface } from '../types/core/config.interface';
import { DatabaseClientInterface } from '../types/core/database-client.interface';
import { LoggerInterface } from '../types/core/logger.interface';
import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { ControllerInterface } from '../types/core/controller.interface';
import { ExceptionFilterInterface } from '../types/core/exception-filter.interface';
import { ControllerRoute } from '../utils/constants.js';
@injectable()
export default class Application {
  private expressApplication: Express;

  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.ConfigInterface) private readonly config: ConfigInterface<ConfigSchema>,
    @inject(AppComponent.DatabaseClientInterface) private readonly databaseClient: DatabaseClientInterface,
    @inject(AppComponent.OfferController) private readonly offerController: ControllerInterface,
    @inject(AppComponent.UserController) private readonly userController: ControllerInterface,
    @inject(AppComponent.CommentController) private readonly commentController: ControllerInterface,
    @inject(AppComponent.ExceptionFilterInterface) private readonly exceptionFilter: ExceptionFilterInterface,
  ) {
    this.expressApplication = express();
  }

  private async _initDb() {
    this.logger.info(`Database ${LoggerInfoMessage.Init}`);
    const uri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME')
    );
    await this.databaseClient.connect(uri);
    this.logger.info(`Database ${LoggerInfoMessage.InitDone}`);
  }

  private async _initServer() {
    this.logger.info(`Server ${LoggerInfoMessage.Init}`);

    const port = this.config.get('PORT');
    this.expressApplication.listen(port);

    const pathName = `http://localhost:${port}`;
    this.logger.info(LoggerInfoMessage.InitServerDone.concat(pathName));
  }

  private async _initController() {
    this.logger.info(`Controller ${LoggerInfoMessage.Init}`);
    this.expressApplication.use(ControllerRoute.OffersList, this.offerController.router);
    this.expressApplication.use(ControllerRoute.User, this.userController.router);
    this.expressApplication.use(ControllerRoute.Comment, this.commentController.router);
    this.logger.info(`Controller ${LoggerInfoMessage.InitDone}`);
  }

  private async _initMiddleware() {
    this.logger.info(`Global middleware ${LoggerInfoMessage.Init}`);
    this.expressApplication.use(express.json());
    this.logger.info(`Global middleware ${LoggerInfoMessage.InitDone}`);
  }

  private async _initExceptionFilters() {
    this.logger.info(`ExceptionFilters ${LoggerInfoMessage.Init}`);
    this.expressApplication.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    this.logger.info(`ExceptionFilters ${LoggerInfoMessage.InitDone}`);
  }

  public async init() {
    this.logger.info(`Application ${LoggerInfoMessage.Init}`);
    await this._initDb();
    await this._initMiddleware();
    await this._initController();
    await this._initExceptionFilters();
    await this._initServer();
  }
}
