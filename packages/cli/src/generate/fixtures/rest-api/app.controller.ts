// 3p
import { MyController, MyController2 } from './controllers';

export class AppController {
  subControllers = [
    controller('/', MyController),
    controller('/', MyController2),
  ];
}
