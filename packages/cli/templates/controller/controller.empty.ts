import { Context, Get, HttpResponseOK } from '@foal/core';

export class /* upperFirstCamelName */Controller {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
