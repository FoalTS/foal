import { Config, Context, Get, HttpResponseOK } from '@foal/core';
import { getRSAPublicKeyFromJWKS } from '@foal/jwks-rsa';
import { JWTRequired } from '@foal/jwt';

export class ApiController {

  @Get('/')
  @JWTRequired({
    secretOrPublicKey: getRSAPublicKeyFromJWKS({
      jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
    })
  }, {
    audience: Config.get('google.clientId'),
    issuer: [ 'accounts.google.com', 'https://accounts.google.com' ]
  })
  index(ctx: Context) {
    return new HttpResponseOK(
      `Your email is ${ctx.user.email}!`
    );
  }

}
