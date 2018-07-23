import {
  authenticate,
  controller,
  IModule,
  LoginRequired,
  Module,
  PermissionRequired,
  rest,
  subModule,
} from '@foal/core';

import { AirportController, ViewController } from './controllers';
import { Flight, User } from './entities';
import { AuthModule } from './modules/authentication';
import { FlightService, UserService } from './services';

@Module()
@authenticate(User)
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

  entities = [
    Flight, User
  ];

  subModules = [
    subModule('/auth', AuthModule),
  ];
}
