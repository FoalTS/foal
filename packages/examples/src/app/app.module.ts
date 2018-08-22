import {
  Authenticate,
  controller,
  IModule,
  Module,
} from '@foal/core';

import { AuthController, ViewController } from './controllers';
import { User } from './entities';

@Module()
@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];

  subModules = [

  ];
}
