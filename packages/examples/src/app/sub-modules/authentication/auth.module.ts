import { controller, IModule, Module } from '@foal/core';

import { AuthController } from './controllers/auth.controller';
import { ViewController } from './controllers/view.controller';

@Module()
export class AuthModule implements IModule {
  controllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];
}
