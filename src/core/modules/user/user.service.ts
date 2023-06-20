import { UserEntity } from './user.entity.js';
import { DocumentType, types } from '@typegoose/typegoose';
import CreateUserDto from './dto/create-user.dto.js';
import { UserServiceInterface } from './user-service.interface.js';
import { inject, injectable } from 'inversify';
import { LoggerInterface } from '../../../types/core/logger.interface.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import { LoggerInfoMessage } from '../../logger/logger.constants.js';
import UpdateUserDto from './dto/update-user.dto.js';
import { EntityName } from '../../../utils/constants.js';
import LoginUserDto from './dto/login-user.dto.js';
import { DEFAULT_AVATAR_FILE_NAME } from './user.constants.js';

@injectable()
export default class UserService implements UserServiceInterface {
  constructor(
    @inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface,
    @inject(AppComponent.UserModel) private readonly userModel: types.ModelType<UserEntity>
  ) { }

  public async create(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const user = new UserEntity({...dto, avatarUrl: DEFAULT_AVATAR_FILE_NAME});
    user.setPassword(dto.password, salt);

    const result = await this.userModel.create(user);
    this.logger.info(LoggerInfoMessage.NewData.concat(EntityName.User));

    return result;
  }

  public async updateById(userId: string, dto: UpdateUserDto): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findByIdAndUpdate(userId, dto, { new: true }).exec();
  }

  public async findByEmail(email: string): Promise<DocumentType<UserEntity> | null> {
    return this.userModel.findOne({ email });
  }

  public async findOrCreate(dto: CreateUserDto, salt: string): Promise<DocumentType<UserEntity>> {
    const existingUser = await this.findByEmail(dto.email);

    if (existingUser) {
      return existingUser;
    }

    return this.create(dto, salt);
  }

  public async verifyUser(dto: LoginUserDto, salt: string): Promise<DocumentType<UserEntity> | null> {
    const user = await this.findByEmail(dto.email);

    if (!user) {
      return null;
    }

    if (user.verifyPassword(dto.password, salt)) {
      return user;
    }

    return null;
  }

  public async addToFavoriteList (userId:string, offerId:string): Promise<DocumentType<UserEntity> | null>{
    const user = await this.userModel.findById(userId);
    if(!user){
      return null;
    }

    const favoriteList = user.favoriteList || [];
    const isFavorite = favoriteList.find((offer:string)=> offer === offerId) || false;

    if(isFavorite){
      return null;
    }
    const updatedList = favoriteList.concat(offerId);
    return await this.updateById(userId, {favoriteList: updatedList});
  }

  public async removeFromFavoriteList (userId:string, offerId:string): Promise<DocumentType<UserEntity> | null>{
    const user = await this.userModel.findById(userId);
    if(!user){
      return null;
    }

    const favoriteList = user.favoriteList || [];
    const offerIndex = favoriteList.indexOf(offerId);

    if(offerIndex === -1){
      return null;
    }
    const updatedList = favoriteList.slice(offerIndex + 1);
    return await this.updateById(userId, {favoriteList: updatedList});
  }

  public async getFavoriteListInfo(userId: string): Promise<string[] | null> {
    const data = await this.userModel.findById(userId, {_id:0, favoriteList:1});
    return data?.favoriteList || null;
  }
}
