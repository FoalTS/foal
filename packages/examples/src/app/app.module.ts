import {
  afterThatRemoveField,
  rest,
  route,
} from '@foal/common';
import {
  authenticate,
  Module,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated,
} from '@foal/core';
import { render, view } from '@foal/ejs';

import { User } from './models/user.model';
import { AuthModule } from './modules/authentication';
import { UserService } from './services';

export const AppModule: Module = {
  controllers: [
    rest('/users', UserService)
      .withPreHooks([
        ctx => { ctx.request.body.isAdmin = false; },
      ], 'POST /')
      .withPreHook(restrictAccessToAuthenticated(), 'GET /', 'GET /:id')
      .withPreHook(restrictAccessToAdmin(), 'PUT /:id', 'PATCH /:id', 'DELETE /:id')
      .withPostHook(afterThatRemoveField('password')),
    view('/', require('./templates/index.html'), { name: 'FoalTS' }),
    view('/home', require('./templates/home.html'))
      .withPreHook(restrictAccessToAuthenticated()),
    route('GET', '/error', () => {
        throw new Error('This is an error.');
      })
  ],
  modules: [
    AuthModule,
  ],
  preHooks: [
    authenticate(User)
  ]
};
