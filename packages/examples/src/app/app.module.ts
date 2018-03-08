import {
  authenticate,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated,
} from '@foal/authentication';
import {
  afterThatRemoveField,
  rest,
} from '@foal/common';
import { Module } from '@foal/core';

import { AuthModule } from './authentication';
import { HomeModule } from './home';
import { PublicModule } from './public';
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
      .withPostHook(afterThatRemoveField('password'))
  ],
  modules: [
    AuthModule,
    HomeModule,
    PublicModule,
  ],
  preHooks: [
    authenticate(UserService)
  ]
};
