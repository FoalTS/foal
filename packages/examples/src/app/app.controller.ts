import { controller } from '@foal/core';

import { AuthController, ViewController } from './controllers';

export class AppController {
  subControllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];
}
