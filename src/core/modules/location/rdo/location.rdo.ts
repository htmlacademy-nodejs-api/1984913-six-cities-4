import { Expose } from 'class-transformer';

export default class LocationRdo{
  @Expose()
  public id!: string ;

  @Expose()
  public city!: string ;

  @Expose()
  public latitude!: number ;

  @Expose()
  public longitude!: number;
}

