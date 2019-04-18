import { ApiInfo, Context, Get, HttpResponseOK, Put } from '@foal/core';

@ApiInfo({
  title: 'API',
  version: '1.0.0'
})
export class ApiV1Controller {

  @Get('/products/:id')
  getProduct() {
    return new HttpResponseOK();
  }

  @Put('/products/:productId')
  updateProduct() {
    return new HttpResponseOK();
  }

}
