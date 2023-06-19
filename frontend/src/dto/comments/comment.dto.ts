import UserDto from '../user/user.dto.js';

export default class CommentDto {
  public id!: string;

  public text!: string;

  public postDate!: string;

  public rating! : number;

  public user!: UserDto;
}
