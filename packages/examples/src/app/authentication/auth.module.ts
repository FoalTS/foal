import { authentication, validateEmailAndPasswordCredentialsFormat } from '@foal/authentication';
import { Module, route } from '@foal/core';
import { render } from '@foal/ejs';

import { AuthenticatorService } from './authenticator.service';

export const AuthModule: Module = {
  controllers: [
    authentication
      .attachService('/local', AuthenticatorService, {
        failureRedirect: '/auth?invalid_credentials=true',
        successRedirect: '/home',
      })
      .withPreHook(validateEmailAndPasswordCredentialsFormat()),
    authentication
      .attachLogout('/logout', {
        httpMethod: 'POST',
        redirect: '/auth',
      }),
    route
      .attachHandler('GET', '/', () => render(require('./templates/login.html'), { name: 'FoalTS' })),
  ],
  path: '/auth',
};
