import { basic, FoalModule, logger, rest } from '@foal/core';

import { Module1Module } from './module-1/module-1.module';
import { MyController } from './services/my-controller.controller';
import { User } from './services/user.controller';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users', User),
    basic.bindController('/basic', MyController)
  ],
  imports: [
    { module: Module1Module, path: '/team2' }
  ],
  services: [ User, MyController ],
  sharedControllerDecorators: [
    logger('AppModule'),
    logger('AppModule 2'),
  ],
};
