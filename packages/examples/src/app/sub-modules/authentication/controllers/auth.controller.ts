import { Controller, emailSchema, LoginController, strategy } from '@foal/core';

import { Authenticator } from '../services/authenticator.service';

@Controller()
export class AuthController extends LoginController {
  strategies = [
    strategy('/local', Authenticator, emailSchema)
  ];
  redirect = {
    failure: '/auth?invalid_credentials=true',
    logout: '/auth',
    success: '/home',
  };
}
