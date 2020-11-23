import { Context, Get, HttpResponseOK, Post } from '@foal/core';
import { CsrfTokenRequired } from '@foal/csrf';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({ cookie: true })
@CsrfTokenRequired({ doubleSubmitCookie: true })
export class ApiController {

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Post('/')
  postindex(ctx: Context) {
    return new HttpResponseOK('Hello world!!!');
  }

}
