import { login, logout, Module, view } from '@foal/core';

import { Authenticator } from './services/authenticator.service';

export const AuthModule: Module = {
  controllers: [
    // TODO : strategy('local', Authenticator)
    // and redirect.success = /home'
    // and redirect.failure = '/auth?invalid_credentials=true'

    // TODO: logout to /auth

    view('/', require('./templates/login.html'), ctx => {
      return {
        csrfToken: ctx.state.csrfToken,
      };
    })
  ],
  path: '/auth'
};
