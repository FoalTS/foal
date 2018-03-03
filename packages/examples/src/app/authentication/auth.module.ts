import { validate } from '@foal/ajv';
import { authentication } from '@foal/authentication';
import { Module } from '@foal/core';

import { view } from '@foal/common';
import { AuthenticatorService } from './authenticator.service';
import { LoginViewService } from './login-view.service';

export const AuthModule: Module = {
  controllers: [
    authentication
      .attachService('/local', AuthenticatorService)
      .withPreHook(validate({
        additionalProperties: false,
        properties: {
          email: { type: 'string', format: 'email' },
          password: { type: 'string' }
        },
        required: [ 'email', 'password' ],
        type: 'object',
      })),
    view
      .attachService('/local', LoginViewService)
  ],
  path: '/auth',
};
