import { IModule, Module } from '@foal/core';

import { Authenticator } from './services/authenticator.service';

@Module()
export class AuthModule implements IModule {
  controllers = [
    // TODO : strategy('local', Authenticator)
    // and redirect.success = /home'
    // and redirect.failure = '/auth?invalid_credentials=true'

    // TODO: logout to /auth
    // TODO: add a view controller with '/', './templates/login.html'
    // and csrfToken: ctx.state.csrfToken,
  ];
}
