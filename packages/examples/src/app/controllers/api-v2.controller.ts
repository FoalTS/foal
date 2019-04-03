import { Context, Get, HttpResponseOK } from '@foal/core';

export class ApiV2Controller {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
