import {
  authenticate,
  HttpResponseOK,
  Module,
  onSuccessKeepFields,
  rest,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated,
  route,
  view,
} from '@foal/core';

import { getAirport } from './handlers';
import { Flight } from './models';
import { User } from './models/user.model';
import { AuthModule } from './modules/authentication';
import { FlightService, UserService } from './services';

export const AppModule: Module = {
  controllers: [
    rest('/users', UserService)
      .withPreHook(ctx => { ctx.request.body.isAdmin = false; }, 'POST /')
      .withPreHook(restrictAccessToAuthenticated(), 'GET /', 'GET /:id')
      .withPreHook(restrictAccessToAdmin(), 'PUT /:id', 'PATCH /:id', 'DELETE /:id')
      .withPostHook(onSuccessKeepFields<User>([ 'id', 'email', 'roles' ])),

    view('/', require('./templates/index.html'), { name: 'FoalTS' }),

    view('/home', require('./templates/home.html'))
      .withPreHook(restrictAccessToAuthenticated()),

    route('GET', '/airport', getAirport),
    rest('/flights', FlightService),
  ],
  models: [
    Flight, User
  ],
  modules: [
    AuthModule,
  ],
  preHooks: [
    authenticate(User)
  ],
};
