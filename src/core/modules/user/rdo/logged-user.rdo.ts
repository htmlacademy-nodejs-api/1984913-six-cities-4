import { Expose } from 'class-transformer';

export default class LoggedUserRdo {
  @Expose()
  public id!: string ;

  @Expose()
  public token!: string;

  @Expose()
  public email!: string;

  @Expose()
  public name!: string;

  @Expose()
  public avatarUrl!: string;

}
