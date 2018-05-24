import { authentication, validateEmailAndPasswordCredentialsFormat } from '@foal/authentication';
import { Module, route, HttpResponseSuccess } from '@foal/core';
import { render } from '@foal/ejs';

import { AuthenticatorService } from './authenticator.service';

export const AuthModule: Module = {
  controllers: [

@pr(validateEmailAndPassword())
    @po(returnCurrentUserOnSuccess([ 'username', 'id' ]))
login('/local', AuthenticatorService(User), {
      failureRedirect: '/auth?invalid_credentials=true',
      successRedirect: '/home',
    });

logout('/logout', {
      httpMethod: 'POST',
      redirect: '/auth',
    }),

    view('/', require('./templates/login.html'), { name: 'FoalTS' }),
  ],
path: '/auth';
}
