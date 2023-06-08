import chalk from 'chalk';
import { CliCommandInterface } from '../../types/core/cli-command.interface.js';
import { CommandName, DEFAULT_DB_PORT, DEFAULT_USER_PASSWORD, ErrorMessage, InfoMessage } from '../../utils/constants.js';
import TSVFileReader from '../file-reader/tsv-file-reader.js';
import { createOffer, getErrorMessage, getMongoURI } from '../helpers/index.js';
import { LoggerInterface } from '../../types/core/logger.interface.js';
import { UserServiceInterface } from '../modules/user/user-service.interface.js';
import { LocationServiceInterface } from '../modules/location/location-service.interface.js';
import { OfferServiceInterface } from '../modules/offer/offer-service.interface.js';
import { DatabaseClientInterface } from '../../types/core/database-client.interface.js';
import ConsoleLoggerService from '../logger/concole.service.js';
import UserService from '../modules/user/user.service.js';
import LocationService from '../modules/location/location.service.js';
import OfferService from '../modules/offer/offer.service.js';
import MongoClientService from '../database-client/mongo-client.service.js';
import { UserModel } from '../modules/user/user.entity.js';
import { OfferModel } from '../modules/offer/offer.entity.js';
import { LocationModel } from '../modules/location/location.entity.js';
import { OfferType } from '../../types/offer.type.js';


export default class ImportCommand implements CliCommandInterface{
  public readonly name = CommandName.Import;

  private logger:LoggerInterface;
  private userService!:UserServiceInterface;
  private locationService!:LocationServiceInterface;
  private offerService!:OfferServiceInterface;
  private databaseService!:DatabaseClientInterface;
  private salt!:string;

  constructor(){
    this.onRow = this.onRow.bind(this);
    this.onComplete = this.onComplete.bind(this);
    this.logger = new ConsoleLoggerService();
    this.userService = new UserService(this.logger, UserModel);
    this.locationService = new LocationService(this.logger, LocationModel);
    this.offerService = new OfferService(this.logger, OfferModel);
    this.databaseService = new MongoClientService(this.logger);
  }

  private async onRow(row:string, resolve:()=>void){
    const offer = createOffer(row);
    await this.saveOffer(offer);
    resolve();
  }

  private onComplete(count:number){
    const message = InfoMessage.Import.concat(count.toString());
    console.log(chalk.bold.blue(message));
    this.databaseService.disconnect();
  }

  private async saveOffer(offer:OfferType){
    const user = await this.userService.findOrCreate({...offer.user, password:DEFAULT_USER_PASSWORD}, this.salt);
    const {latitude, longitude} = offer.location;
    const location = await this.locationService.findByLocationOrCreate(offer.location, {city:offer.city, latitude, longitude });
    await this.offerService.create({...offer, userId:user.id, locationId:location.id});
  }

  public async execute(filename: string, login: string, password: string, host: string, dbname: string, salt: string): Promise<void> {
    const uri = getMongoURI(login, password, host, DEFAULT_DB_PORT, dbname);
    this.salt = salt;

    await this.databaseService.connect(uri);

    const fileReader = new TSVFileReader(filename.trim());

    fileReader.on('row', this.onRow);
    fileReader.on('complete', this.onComplete);

    try{
      await fileReader.read();
    }catch (error) {
      const message = getErrorMessage(error);
      const errorText = ErrorMessage.Import.concat(message);
      console.log(chalk.red(errorText));
    }

  }
}
