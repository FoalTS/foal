import { Authenticate, controller, IModule } from '@foal/core';

import { ViewController } from './controllers';
import { User } from './entities';

@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    controller('/', ViewController),
  ];

  subModules = [

  ];
}
