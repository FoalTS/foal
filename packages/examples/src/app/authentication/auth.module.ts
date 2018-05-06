import { authentication, validateEmailCredentialsFormat } from '@foal/authentication';
import { basic, HttpResponseRedirect, Module } from '@foal/core';

import { view } from '@foal/common';
import { AuthenticatorService } from './authenticator.service';
import { LoginViewService } from './login-view.service';

export const AuthModule: Module = {
  controllers: [
    authentication
      .attachService('/local', AuthenticatorService, {
        failureRedirect: '/auth?invalid_credentials=true',
        successRedirect: '/home',
      })
      .withPreHook(validateEmailCredentialsFormat()),
    authentication
      .attachLogout('/logout', {
        httpMethod: 'POST',
        redirect: '/auth',
      }),
    view
      .attachService('/', LoginViewService)
  ],
  path: '/auth',
};
