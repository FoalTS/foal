import { AuthenticateWithSessionAndCookie, controller } from '@foal/core';

import { ViewController } from './controllers';
import { User } from './entities';

@AuthenticateWithSessionAndCookie(User)
export class AppController {
  subControllers = [
    controller('/', ViewController),
  ];
}
