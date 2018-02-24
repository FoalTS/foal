import {
  afterThatLog,
  log,
  multipleViews,
  rest,
  view,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated
} from '@foal/common';
import { Module } from '@foal/core';

import { IndexViewService, PublicViewsService, UserService } from './services';

export const AppModule: Module = {
  controllers: [
    multipleViews
      .attachService('/', PublicViewsService, {
        views: {}
      }),
    view
      .attachService('/', IndexViewService)
      .withPreHook(ctx => { ctx.state.locals = { name: 'FoalTS' }; }),
    rest
      .attachService('/users', UserService)
      .withPreHooks([
        log('UserService1'),
        log('UserService2')
      ])
      .withPreHooks([
        ctx => { ctx.body.isAdmin = false },
        log('create1'),
        log('create2'),
        afterThatLog('create1 (post)'),
        afterThatLog('create2 (post)')
      ], 'postAll')
      .withPreHook(restrictAccessToAuthenticated(), 'getAll', 'getById')
      .withPreHook(restrictAccessToAdmin(), 'putById', 'patchById', 'deleteById')
      .withPostHooks([
        afterThatLog('UserService1 (post)'),
        afterThatLog('UserService2 (post)')
      ])
  ],
  preHooks: [
    log('AppModule1'),
    log('AppModule2'),
  ],
  postHooks: [
    afterThatLog('AppModule1 (post)'),
    afterThatLog('AppModule2 (post)'),
  ]
};
