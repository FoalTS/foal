import { Context, Get, HttpResponseOK, TokenRequired } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

@TokenRequired({ store: TypeORMStore, cookie: true })
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
