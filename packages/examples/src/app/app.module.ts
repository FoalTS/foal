import { authenticate } from '@foal/authentication';
import {
  afterThatRemoveField,
  rest,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated,
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
      ], 'postAll')
      .withPreHook(restrictAccessToAuthenticated(), 'getAll', 'getById')
      .withPreHook(restrictAccessToAdmin(), 'putById', 'patchById', 'deleteById')
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
