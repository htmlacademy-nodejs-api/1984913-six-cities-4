import { Expose } from 'class-transformer';

export default class LocationRdo{

  @Expose()
  public latitude!: number ;

  @Expose()
  public longitude!: number;
}

