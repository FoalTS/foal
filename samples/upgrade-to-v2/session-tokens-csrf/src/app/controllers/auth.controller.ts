import {
  Context, dependency, hashPassword, HttpResponseRedirect, Post,
  removeSessionCookie, Session, setSessionCookie, TokenRequired,
  ValidateBody, verifyPassword
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

import { User } from '../entities';

import { getRepository } from 'typeorm';
import { CsrfTokenRequired } from '@foal/csrf';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    const session = await this.store.createAndSaveSessionFromUser(
      user,
      // Generate the CSRF token and keep it in the session
      { csrfToken: true }
    );
    const response = new HttpResponseRedirect('/home');
    const token = session.getToken();
    setSessionCookie(response, token);
    return response;
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseRedirect('/login');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseRedirect('/login');
    }

    const session = await this.store.createAndSaveSessionFromUser(
      user,
      // Generate the CSRF token and keep it in the session
      { csrfToken: true }
    );
    const response = new HttpResponseRedirect('/home');
    const token = session.getToken();
    setSessionCookie(response, token);
    return response;
  }

  @Post('/logout')
  @TokenRequired({
    cookie: true,
    extendLifeTimeOrUpdate: false,
    redirectTo: '/login',
    store: TypeORMStore,
  })
  @CsrfTokenRequired()
  async logout(ctx: Context<any, Session>) {
    await this.store.destroy(ctx.session.sessionID);
    const response = new HttpResponseRedirect('/login');
    removeSessionCookie(response);
    return response;
  }
}
