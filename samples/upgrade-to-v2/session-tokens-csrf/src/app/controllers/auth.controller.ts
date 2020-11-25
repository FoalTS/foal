import {
  Context, dependency, hashPassword, HttpResponseRedirect, Post, Session,
  ValidateBody, verifyPassword, Store, UseSessions
} from '@foal/core';

import { User } from '../entities';

import { getRepository } from 'typeorm';

const credentialsSchema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

@UseSessions({
  cookie: true,
})
export class AuthController {
  @dependency
  store: Store;

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context<any, Session>) {
    const user = new User();
    user.email = ctx.request.body.email;
    user.password = await hashPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    ctx.session.setUser(user);

    return new HttpResponseRedirect('/home');
  }

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context<any, Session>) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseRedirect('/login');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseRedirect('/login');
    }

    ctx.session.setUser(user);

    return new HttpResponseRedirect('/home');
  }

  @Post('/logout')
  async logout(ctx: Context) {
    if (ctx.session) {
      await ctx.session.destroy();
    }

    return new HttpResponseRedirect('/login');
  }
}
