import { Container } from 'inversify';
import { UserServiceInterface } from './user-service.interface.js';
import UserService from './user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../../types/app-component.enum.js';

export function createUserContainer() {
  const container = new Container();
  container.bind<UserServiceInterface>(AppComponent.UserServiceInterface).to(UserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(AppComponent.UserModel).toConstantValue(UserModel);

  return container;
}
