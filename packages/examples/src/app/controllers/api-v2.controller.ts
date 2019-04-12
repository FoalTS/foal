import { ApiDefineResponse, ApiDefineTag, ApiInfo, Context, controller, Get, HttpResponseOK } from '@foal/core';
import { ProductController } from './product.controller';

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

  subControllers = [
    controller('/products', ProductController)
  ];

  @Get('/foo')
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
