import { controller } from '@foal/core';

import { ApiController, AuthController, ViewController } from './controllers';

export class AppController {
  subControllers = [
    AuthController,
    ViewController,
    controller('/api', ApiController),
  ];
}
