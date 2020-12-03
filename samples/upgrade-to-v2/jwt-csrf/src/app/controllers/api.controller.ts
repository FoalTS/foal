import { Context, Get, HttpResponseOK, Post } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({ cookie: true })
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
