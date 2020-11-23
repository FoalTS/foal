import { controller } from '@foal/core';

import { ApiController, LoginController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    LoginController
  ];
}
