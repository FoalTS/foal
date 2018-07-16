import {
  authenticate,
  LoginRequired,
  Module,
  PermissionRequired,
  rest,
  view,
} from '@foal/core';

import { getAirport } from './controllers';
import { Flight, User } from './entities';
import { AuthModule } from './modules/authentication';
import { FlightService, UserService } from './services';

export const AppModule: Module = {
  controllers: [
    rest('/users', UserService)
      .withPreHook(ctx => { ctx.request.body.isAdmin = false; }, 'POST /')
      .withPreHook(LoginRequired(), 'GET /', 'GET /:id')
      .withPreHook(PermissionRequired('admin'), 'PUT /:id', 'PATCH /:id', 'DELETE /:id'),

    view('/', require('./templates/index.html'), { name: 'FoalTS' }),

    view('/home', require('./templates/home.html'))
      .withPreHook(LoginRequired()),

    // route('GET', '/airport', getAirport),
    rest('/flights', FlightService),
  ],
  entities: [
    Flight, User
  ],
  modules: [
    AuthModule,
  ],
  preHooks: [
    authenticate(User)
  ],
};
