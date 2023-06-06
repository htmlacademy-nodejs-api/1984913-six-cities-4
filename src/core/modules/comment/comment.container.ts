
import { Container } from 'inversify';
import { types } from '@typegoose/typegoose';
import { CommentServiceInterface } from './comment-service.interface.js';
import { CommentEntity, CommentModel } from './comment.entity.js';
import CommentService from './comment.service.js';
import { AppComponent } from '../../../types/app-component.enum.js';
import CommentController from './comment.controller.js';
import { ControllerInterface } from '../../../types/core/controller.interface.js';

export function createCommentContainer() {
  const container = new Container();
  container.bind<CommentServiceInterface>(AppComponent.CommentServiceInterface).to(CommentService).inSingletonScope();
  container.bind<types.ModelType<CommentEntity>>(AppComponent.CommentModel).toConstantValue(CommentModel);
  container.bind<ControllerInterface>(AppComponent.CommentController).to(CommentController).inSingletonScope();

  return container;
}
