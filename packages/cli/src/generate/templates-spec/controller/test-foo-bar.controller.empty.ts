import { Context, Controller, Get, HttpResponseOK } from '@foal/core';

@Controller()
export class TestFooBarController {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
