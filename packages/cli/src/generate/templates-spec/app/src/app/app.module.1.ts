import { controller, IModule, Module } from '@foal/core';

import { ViewController } from './controllers';

@Module()
export class AppModule implements IModule {
  controllers = [
    controller('/', ViewController),
  ];

  subModules = [

  ];

  entities = [

  ];
}
