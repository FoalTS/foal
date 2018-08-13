import {
  Authenticate,
  controller,
  Group,
  IModule,
  InitDB,
  Module,
  Permission,
} from '@foal/core';

import { AuthController, ViewController } from './controllers';
import { User } from './entities';

@Module()
@InitDB([ Permission, Group, User ])
@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];

  subModules = [

  ];
}
