import { ApiDefineResponse, ApiDefineTag, ApiInfo, Context, Get, HttpResponseOK } from '@foal/core';

@ApiInfo({
  license: {
    name: 'toto',
    url: 'http://foobar.com'
  },
  title: 'Api',
  version: 'v2',
})
@ApiDefineTag({
  description: 'my tag',
  name: 'tag1',
})
export class ApiV2Controller {

  @Get('/')
  @ApiDefineResponse('Good success', {
    content: {
      'application/json': {
        example: {
          foo: 1
        }
      }
    },
    description: 'An incredible response',
  })
  foo(ctx: Context) {
    return new HttpResponseOK();
  }

}
