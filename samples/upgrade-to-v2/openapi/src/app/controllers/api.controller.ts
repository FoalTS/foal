import { ApiInfo, Context, Get, HttpResponseOK, ValidateCookie } from '@foal/core';

@ApiInfo({
  title: 'A Great API',
  version: '1.0.0'
})
export class ApiController {

  @Get('/')
  @ValidateCookie('foobar')
  index(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
