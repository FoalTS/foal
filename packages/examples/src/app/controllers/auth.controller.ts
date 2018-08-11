import { Context, Controller, emailSchema, Get, LoginController, render, strategy } from '@foal/core';

import { Authenticator } from '../services/authenticator.service';
import { login } from './templates';

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

  @Get('/')
  renderLogin(ctx: Context) {
    return render(login, { csrfToken: ctx.request.csrfToken() });
  }
}
