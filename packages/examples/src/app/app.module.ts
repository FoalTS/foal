import {
  Authenticate,
  controller,
  IModule,
} from '@foal/core';

import { AuthController, ViewController } from './controllers';
import { User } from './entities';

@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];

  subModules = [

  ];
}
