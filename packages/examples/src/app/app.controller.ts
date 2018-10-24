import {
  AuthenticateWithSessionAndCookie,
  controller,
} from '@foal/core';

import { AuthController, ViewController } from './controllers';
import { User } from './entities';

@AuthenticateWithSessionAndCookie(User)
export class AppController {
  subControllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];
}
