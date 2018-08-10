import { Context, Controller, Get, HttpResponseOK } from '@foal/core';

@Controller()
export class /* upperFirstCamelName */Controller {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
