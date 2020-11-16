import { Context, Get, HttpResponseOK, ValidateCookies, ValidateHeaders, ValidateParams, ValidateQuery } from '@foal/core';

export class ApiController {

  @Get('/headers')
  @ValidateHeaders({
    properties: {
      // All properties should be in lower case.
      'a-number': { type: 'integer' },
      'authorization': { type: 'string' },
    },
    required: [ 'authorization' ],
    type: 'object'
  })
  headers(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/query')
  @ValidateQuery({
    properties: {
      'a-number': { type: 'integer' },
      'authorization': { type: 'string' },
    },
    required: [ 'authorization' ],
    type: 'object'
  })
  query(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/params/:productId')
  @ValidateParams({
    properties: {
      productId: { type: 'integer' }
    },
    type: 'object'
  })
  params(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

  @Get('/cookies')
  @ValidateCookies({
    properties: {
      'A-Number': { type: 'integer' },
      'Authorization': { type: 'string' },
    },
    required: [ 'Authorization' ],
    type: 'object'
  })
  cookies(ctx: Context) {
    return new HttpResponseOK('Hello world!');
  }

}
