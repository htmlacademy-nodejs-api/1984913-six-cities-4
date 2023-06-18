import { IsString, IsOptional, IsArray } from 'class-validator';
export default class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'avatarUrl is required' })
  public avatarUrl?: string;

  @IsOptional()
  @IsArray()
  public favoriteList?: string[];
}
