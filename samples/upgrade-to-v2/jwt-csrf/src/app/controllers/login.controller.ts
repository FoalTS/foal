import {
  Context, HttpResponseOK,
  Post, ValidateBody
} from '@foal/core';
import { getSecretOrPrivateKey, removeAuthCookie, setAuthCookie } from '@foal/jwt';
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
      getSecretOrPrivateKey(),
      { expiresIn: '1h' }
    );

    const response = new HttpResponseOK();
    await setAuthCookie(response, token);
    return response;
  }

  @Post('/logout')
  logout() {
    const response = new HttpResponseOK();
    removeAuthCookie(response);
    return response;
  }

}
