import {
  authenticate,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated,
} from '@foal/authentication';
import {
  afterThatRemoveField,
  rest,
} from '@foal/common';
import { Module, route } from '@foal/core';
import { render } from '@foal/ejs';

import { AuthModule } from './authentication';
import { UserService } from './shared';

export const AppModule: Module = {
  controllers: [
    rest
      .attachService('/users', UserService)
      .withPreHooks([
        ctx => { ctx.body.isAdmin = false; },
      ], 'POST /')
      .withPreHook(restrictAccessToAuthenticated(), 'GET /', 'GET /:id')
      .withPreHook(restrictAccessToAdmin(), 'PUT /:id', 'PATCH /:id', 'DELETE /:id')
      .withPostHook(afterThatRemoveField('password')),
    route
      .attachHandler('GET', '/', () => render(require('./templates/index.html'), { name: 'FoalTS' })),
    route
      .attachHandler('GET', '/', () => render(require('./templates/home.html')))
      .withPreHook(restrictAccessToAuthenticated()),
    route
      .attachHandler('GET', '/error', () => {
        throw new Error('This is an error.');
      })
  ],
  modules: [
    AuthModule,
  ],
  preHooks: [
    authenticate(UserService)
  ]
};
