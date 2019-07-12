// 3p
import {
  Context, dependency, HttpResponseRedirect, Post, removeSessionCookie,
  Session, setSessionCookie, TokenRequired, ValidateBody, verifyPassword
} from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { getRepository } from 'typeorm';

import { User } from '../entities';

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/login')
  // Validate the request body.
  @ValidateBody({
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
    },
    required: ['email', 'password'],
    type: 'object',
  })
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      // Redirect the user to /signin if the authentication fails.
      return new HttpResponseRedirect('/signin?bad_credentials=true');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      // Redirect the user to /signin if the authentication fails.
      return new HttpResponseRedirect('/signin?bad_credentials=true');
    }

    // Create a session associated with the user.
    const session = await this.store.createAndSaveSessionFromUser(user);

    // Redirect the user to the home page on success.
    const response = new HttpResponseRedirect('/');
    // Save the session token in a cookie in order to authenticate
    // the user in future requests.
    setSessionCookie(response, session.getToken());
    return response;
  }

  @Post('/logout')
  @TokenRequired({
    cookie: true,
    extendLifeTimeOrUpdate: false,
    redirectTo: '/signin',
    store: TypeORMStore,
  })
  async logout(ctx: Context<User, Session>) {
    // Destroy the user session.
    await this.store.destroy(ctx.session.sessionID);

    // Redirect the user to the home page on success.
    const response = new HttpResponseRedirect('/signin');
    // Remove the cookie where the session token is stored.
    removeSessionCookie(response);
    return response;
  }
}
