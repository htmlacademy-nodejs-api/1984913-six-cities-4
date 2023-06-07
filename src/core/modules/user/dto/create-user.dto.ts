import { IsEmail, IsString, Length, IsEnum } from 'class-validator';
import { UserNameLength, UserPasswordLength, UserStatus, } from '../user.constants.js';
export default class CreateUserDto {
  @IsEmail({}, { message: 'email must be valid address' })
  public email!: string;

  @IsString({ message: 'avatarUrl is required' })
  public avatarUrl!: string;

  @IsString({ message: 'name is required' })
  @Length(UserNameLength.Min, UserNameLength.Max, {
    message: `Min length is ${UserNameLength.Min}, max is ${UserNameLength.Max}`,
  })
  public name!: string;

  @IsEnum(UserStatus, {
    message: `type must be one of ${Object.values(UserStatus).join(', ')}`,
  })
  public userStatus!: string;

  @IsString({ message: 'password is required' })
  @Length(UserPasswordLength.Min, UserPasswordLength.Max, {
    message: `Min length is ${UserPasswordLength.Min}, max is ${UserPasswordLength.Max}`,
  })
  public password!: string;
}
