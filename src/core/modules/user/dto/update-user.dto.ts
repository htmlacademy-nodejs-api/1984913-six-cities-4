import { IsString, Length, IsEnum, IsOptional } from 'class-validator';
import { UserNameLength, UserStatus, } from '../user.constants.js';
export default class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'avatarUrl is required' })
  public avatarUrl?: string;

  @IsOptional()
  @IsString({ message: 'name is required' })
  @Length(UserNameLength.Min, UserNameLength.Max, {
    message: `Min length is ${UserNameLength.Min}, max is ${UserNameLength.Max}`,
  })
  public name?: string;

  @IsOptional()
  @IsEnum(UserStatus, {
    message: `type must be one of ${Object.values(UserStatus).join(', ')}`,
  })
  public userStatus?: UserStatus;
}
