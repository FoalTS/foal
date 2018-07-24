import {
  Authenticate,
  controller,
  IModule,
  InitDB,
  LoginRequired,
  Module,
  PermissionRequired,
  rest,
  subModule,
} from '@foal/core';

import { AirportController, ViewController } from './controllers';
import { Flight, User } from './entities';
import { FlightService, UserService } from './services';
import { AuthModule } from './sub-modules/authentication';

@Module()
@InitDB([ Flight, User ])
@Authenticate(User)
export class AppModule implements IModule {
  controllers = [
    rest('/users', UserService)
      .withPreHook(ctx => { ctx.request.body.isAdmin = false; }, 'POST /')
      .withPreHook(LoginRequired(), 'GET /', 'GET /:id')
      .withPreHook(PermissionRequired('admin'), 'PUT /:id', 'PATCH /:id', 'DELETE /:id'),

    controller('/airport', AirportController),
    controller('', ViewController),
    rest('/flights', FlightService),
  ];

  subModules = [
    subModule('/auth', AuthModule),
  ];
}
