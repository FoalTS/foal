import { Context, Controller, emailSchema, Get, LoginController, render, strategy } from '@foal/core';

import { Authenticator } from '../services/authenticator.service';
import { login } from './templates';

@Controller()
export class AuthController extends LoginController {
  strategies = [
    strategy('login', Authenticator, emailSchema)
  ];
  redirect = {
    failure: '/login?invalid_credentials=true',
    logout: '/login',
    success: '/',
  };

  @Get('/login')
  renderLogin(ctx: Context) {
    return render(login, { csrfToken: ctx.request.csrfToken() });
  }
}
