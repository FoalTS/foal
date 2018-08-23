import { Context, Controller, emailSchema, Get, LoginController, render, strategy } from '@foal/core';

import { Authenticator } from '../services/authenticator.service';

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
    return render('./templates/login.html', { csrfToken: ctx.request.csrfToken() }, __dirname);
  }
}
