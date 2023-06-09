import { User } from '../../../types/user.type';
import typegoose, {getModelForClass, defaultClasses} from '@typegoose/typegoose';
import { createSHA256 } from '../../helpers/common.js';

const {prop, modelOptions} = typegoose;

export interface UserEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'users'
  }
})
export class UserEntity extends defaultClasses.TimeStamps implements User{
  @prop({required:true, default:''})
  public name:string;

  @prop({required:true, unique:true})
  public email:string;

  @prop({default:''})
  public avatarUrl:string;

  @prop({default:false})
  public userStatus:string;

  @prop({required: true, default: ''})
  private password?: string;

  @prop({default:[]})
  public favoriteList?: string[] ;

  constructor(userData: User) {
    super();

    this.email = userData.email;
    this.avatarUrl = userData.avatarUrl;
    this.name = userData.name;
    this.userStatus = userData.userStatus;
    this.favoriteList = userData.favoriteList || [];
  }

  public setPassword(password: string, salt: string) {
    this.password = createSHA256(password, salt);
  }

  public getPassword() {
    return this.password;
  }

  public verifyPassword(password: string, salt: string) {
    const hashPassword = createSHA256(password, salt);
    return hashPassword === this.password;
  }
}
export const UserModel = getModelForClass(UserEntity);
