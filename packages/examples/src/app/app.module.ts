import {
  authenticate,
  HttpResponseOK,
  initDB,
  Module,
  onSuccessKeepFields,
  rest,
  restrictAccessToAdmin,
  restrictAccessToAuthenticated,
  route,
  view,
} from '@foal/core';

import { User } from './models/user.model';
import { AuthModule } from './modules/authentication';
import { UserService } from './services';

export const AppModule: Module = {
  controllers: [
    rest('/users', UserService)
      .withPreHooks([
        ctx => { ctx.request.body.isAdmin = false; },
      ], 'POST /')
      .withPreHook(restrictAccessToAuthenticated(), 'GET /', 'GET /:id')
      .withPreHook(restrictAccessToAdmin(), 'PUT /:id', 'PATCH /:id', 'DELETE /:id')
      .withPostHook(onSuccessKeepFields<User>([ 'id', 'email', 'roles' ])),
    view('/', require('./templates/index.html'), { name: 'FoalTS' }),
    view('/home', require('./templates/home.html'))
      .withPreHook(restrictAccessToAuthenticated()),
    route('GET', '/error', () => {
        throw new Error('This is an error.');
      }),
    route('GET', '/one_user', ctx => {
      const user = new User();
      user.roles = [ 'admin' ];
      return new HttpResponseOK(user);
    })
  ],
  modules: [
    AuthModule,
  ],
  preHooks: [
    initDB([ User ]),
    authenticate(User)
  ]
};
