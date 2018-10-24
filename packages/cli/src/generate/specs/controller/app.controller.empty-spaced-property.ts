// 3p
import {} from 'somewhere';
import { TestFooBarController } from './controllers';

export class MyController {
  subControllers = [
    controller('/test-foo-bar', TestFooBarController)
  ];
}
