// 3p
import {
  Context, Get, HttpResponseRedirect, logIn,
  logOut, Post, render, ValidateBody, verifyPassword
} from '@foal/core';
import { getRepository } from 'typeorm';

// App
import { User } from '../entities';

export class AuthController {
  @Get('/logout')
  logout(ctx: Context) {
    logOut(ctx);
    return new HttpResponseRedirect('/login');
  }

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async login(ctx: Context) {
    const user = await getRepository(User)
      .findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseRedirect('/login?invalid_credentials=true');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseRedirect('/login?invalid_credentials=true');
    }

    logIn(ctx, user);

    return new HttpResponseRedirect('/');
  }

  @Get('/login')
  renderLogin(ctx: Context) {
    return render('./templates/login.html', { csrfToken: ctx.request.csrfToken() }, __dirname);
  }
}
