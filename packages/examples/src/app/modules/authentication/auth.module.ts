import { login, logout, validateEmailAndPasswordCredentialsFormat } from '@foal/authentication';
import { route } from '@foal/common';
import { HttpResponseSuccess, Module } from '@foal/core';
import { view } from '@foal/ejs';

import { AuthenticatorService } from './services/authenticator.service';

export const AuthModule: Module = {
  controllers: [
    login('/local', AuthenticatorService, {
      failureRedirect: '/auth?invalid_credentials=true',
      successRedirect: '/home',
    }),
      // .withPreHook(validateEmailAndPassword())
      // .withPostHook(returnCurrentUserOnSuccess([ 'username', 'id' ])),

    logout('/logout', {
      httpMethod: 'POST',
      redirect: '/auth',
    }),

    view('/', require('./templates/login.html'), { name: 'FoalTS' })
  ],
  path: '/auth'
};
