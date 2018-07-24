import {
  Authenticate,
  controller,
  Group,
  IModule,
  InitDB,
  Module,
  Permission,
  subModule,
} from '@foal/core';

import { AirportController, FlightController, ViewController } from './controllers';
import { Flight, User } from './entities';
import { AuthModule } from './sub-modules/authentication';

@Module()
@InitDB([ Permission, Group, User, Flight ])
@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    controller('/airport', AirportController),
    controller('', ViewController),
    controller('/flights', FlightController)
  ];

  subModules = [
    subModule('/auth', AuthModule),
  ];
}
