import { controller } from '@foal/core';

import { ViewController } from './controllers';

export class AppController {
  subControllers = [
    controller('/', ViewController),
  ];
}
