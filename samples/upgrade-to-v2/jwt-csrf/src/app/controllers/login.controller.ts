import {
  Config, Context, HttpResponseOK,
  Post, ValidateBody
} from '@foal/core';
import { getCsrfToken, setCsrfCookie } from '@foal/csrf';
import { sign } from 'jsonwebtoken';

export class LoginController {

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
    },
    required: [ 'email' ],
    type: 'object',
  })
  async login(ctx: Context, params, { email }) {
    const token = sign(
      { email },
      Config.get<string>('settings.jwt.secretOrPublicKey'),
      { expiresIn: '1h' }
    );

    const response = new HttpResponseOK()
      .setCookie('auth', token, {
        maxAge: 3600,
        sameSite: 'lax'
      });
    setCsrfCookie(response, await getCsrfToken());
    return response;
  }

  @Post('/logout')
  logout() {
    return new HttpResponseOK()
      .setCookie('auth', '', { maxAge: 0 });
  }

}
