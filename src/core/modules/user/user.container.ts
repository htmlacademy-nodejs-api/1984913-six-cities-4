import { Container } from 'inversify';
import { UserServiceInterface } from './user-service.interface.js';
import UserService from './user.service.js';
import { AppComponent } from '../../../utils/constants.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';

export function createUserContainer() {
  const container = new Container();
  container.bind<UserServiceInterface>(AppComponent.UserServiceInterface).to(UserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(AppComponent.UserServiceInterface).toConstantValue(UserModel);

  return container;
}
