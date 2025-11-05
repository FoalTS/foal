import { Context, Get, HttpResponseOK } from '@foal/core';

export class TestFooBarController {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
