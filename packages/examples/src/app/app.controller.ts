import { controller } from '@foal/core';

import { AuthController, OpenApiController, ViewController } from './controllers';

export class AppController {
  subControllers = [
    controller('', AuthController),
    controller('', ViewController),
    controller('/swagger', OpenApiController)
  ];
}
