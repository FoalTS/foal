// 3p
import {} from 'somewhere';
import { TestFooBarController } from './controllers';

export class MyModule {
  controllers = [
    controller('/', MyController),
    controller('/', TestFooBarController)
  ];
}
