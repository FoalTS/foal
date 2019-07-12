// 3p
import { Context, dependency, HttpResponseRedirect, Post, setSessionCookie, ValidateBody } from '@foal/core';
import { isCommon } from '@foal/password';
import { TypeORMStore } from '@foal/typeorm';
import { getRepository } from 'typeorm';

// App
import { User } from '../entities';

export class SignupController {
  @dependency
  store: TypeORMStore;

  @Post()
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async signup(ctx: Context) {
    // Check that the password is not too common.
    if (await isCommon(ctx.request.body.password)) {
      return new HttpResponseRedirect('/signup?password_too_common=true');
    }

    // Check that no user has already signed up with this email.
    let user = await getRepository(User).findOne({ email: ctx.request.body.email });
    if (user) {
      return new HttpResponseRedirect('/signup?email_already_taken=true');
    }

    // Create the user.
    user = new User();
    user.email = ctx.request.body.email;
    await user.setPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    // Create the user session.
    const session = await this.store.createAndSaveSessionFromUser(user);

    // Redirect the user to her/his to-do list.
    const response = new HttpResponseRedirect('/');
    // Save the session token in a cookie in order to authenticate
    // the user in future requests.
    setSessionCookie(response, session.getToken());
    return response;
  }

}
