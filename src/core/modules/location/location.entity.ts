import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { LocationType } from '../../../types/offer.type';

const {prop, modelOptions} = typegoose;

export interface LocationEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'locations'
  }
})
export class LocationEntity extends defaultClasses.TimeStamps implements LocationType{
  @prop({required:true, default:''})
  public city!:string;

  @prop({required:true, default:''})
  public latitude!:number;

  @prop({required:true, default:''})
  public longitude!:number;
}

export const LocationModel = getModelForClass(LocationEntity);
