import { dependency, Get, HttpResponseOK } from '@foal/core';
import { Msg } from './services';

export class AppController {

  @dependency
  msg: Msg;

  init() {
    this.msg.message += '!';
  }

  @Get('/')
  index() {
    return new HttpResponseOK(this.msg.message);
  }

}
