import { controller, Group, IModule, initDB, Module, Permission } from '@foal/core';

import { ViewController } from './controllers';
import { User } from './entities';

@Module()
@initDB([ Group, Permission, User ])
export class AppModule implements IModule {
  controllers = [
    controller('/', ViewController),
  ];

  subModules = [

  ];
}
