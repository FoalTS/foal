import {
  Authenticate,
  controller,
} from '@foal/core';

import { AuthController, ViewController } from './controllers';
import { User } from './entities';

@Authenticate(User)
export class AppController {
  subControllers = [
    controller('', AuthController),
    controller('', ViewController),
  ];
}
