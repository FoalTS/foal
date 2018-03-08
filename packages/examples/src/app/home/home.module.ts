import { restrictAccessToAuthenticated } from '@foal/authentication';
import { view } from '@foal/common';
import { Module } from '@foal/core';
import { HomeViewService } from './home-view.service';

export const HomeModule: Module = {
  controllers: [
    view
      .attachService('/', HomeViewService)
      .withPreHook(restrictAccessToAuthenticated())
  ],
  path: '/home'
};
