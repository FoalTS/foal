import { validate } from '@foal/ajv';
import { authentication } from '@foal/authentication';
import { Module } from '@foal/core';

import { AuthenticatorService } from './authenticator.service';
import { multipleViews, view, log, afterThatLog } from '@foal/common';
import { LoginViewService } from './login-view.service';

export const AuthModule: Module = {
  path: '/auth',
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
  ]
};
