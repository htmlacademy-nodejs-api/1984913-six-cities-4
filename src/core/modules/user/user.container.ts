import { Container } from 'inversify';
import { UserServiceInterface } from './user-service.interface.js';
import UserService from './user.service.js';
import { UserEntity, UserModel } from './user.entity.js';
import { types } from '@typegoose/typegoose';
import { AppComponent } from '../../../types/app-component.enum.js';
import { ControllerInterface } from '../../../types/core/controller.interface.js';
import UserController from './user.controller.js';

export function createUserContainer() {
  const container = new Container();
  container.bind<UserServiceInterface>(AppComponent.UserServiceInterface).to(UserService).inSingletonScope();
  container.bind<types.ModelType<UserEntity>>(AppComponent.UserModel).toConstantValue(UserModel);
  container.bind<ControllerInterface>(AppComponent.UserController).to(UserController).inSingletonScope();

  return container;
}
