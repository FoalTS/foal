// 3p
import {
  Context,
  dependency,
  Get,
  HttpResponseRedirect,
  Post,
  removeSessionCookie,
  render,
  Session,
  setSessionCookie,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { getRepository } from 'typeorm';

// App
import { User } from '../entities';

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Get('/logout')
  logout(ctx: Context<any, Session>) {
    const response = new HttpResponseRedirect('/login');
    this.store.destroy(ctx.session.sessionID);
    removeSessionCookie(response);
    return response;
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

    const session = await this.store.createAndSaveSession({ userId: user.id });

    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session);
    return response;
  }

  @Get('/login')
  renderLogin(ctx: Context) {
    return render('./templates/login.html', { csrfToken: ctx.request.csrfToken() }, __dirname);
  }
}
