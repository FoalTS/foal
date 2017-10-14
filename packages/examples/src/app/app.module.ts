import { basic, FoalModule, rest } from '@foal/core';

import { Module1Module } from './module-1/module-1.module';
import { MyController } from './services/my-controller.controller';
import { User } from './services/user.controller';
import { User2 } from './services/user2.controller';

export const AppModule: FoalModule = {
  controllerBindings: [
    rest.bindController('/users', User),
    rest.bindController('/users2', User2),
    basic.bindController('/basic', MyController)
  ],
  imports: [
    { module: Module1Module, path: '/team2' }
  ],
  services: [ User, User2, MyController ]
};
