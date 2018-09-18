// 3p
import {} from 'somewhere';
import { TestFooBarController } from './controllers';

export class MyController {
  subControllers = [
    controller('/', TestFooBarController)
  ];
}
