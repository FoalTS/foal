import { Context, Get, HttpResponseOK, ValidateCookie, ValidateHeader, ValidatePathParam, ValidateQueryParam } from '@foal/core';

export class ApiController {

  @Get('/headers')
  @ValidateHeader('Authorization')
  @ValidateHeader('A-Number', { type: 'integer' }, { required: false })
  headers(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/query')
  @ValidateQueryParam('authorization')
  @ValidateQueryParam('a-number', { type: 'integer' }, { required: false })
  query(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/params/:productId')
  @ValidatePathParam('productId', { type: 'integer' })
  params(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/cookies')
  @ValidateCookie('Authorization')
  @ValidateCookie('A-Number', { type: 'integer' }, { required: false })
  cookies(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
