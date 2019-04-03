import { ApiInfo, Context, Get, HttpResponseOK } from '@foal/core';

@ApiInfo({
  title: 'API',
  version: '1.0.0'
})
export class ApiV1Controller {

  @Get('/')
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
