// 3p
import { MyController, MyController2, TestFooBarController } from './controllers';
import { controller } from '@foal/core';

export class AppController {
  subControllers = [
    controller('/', MyController),
    controller('/', MyController2),
    controller('/test-foo-bars', TestFooBarController)
  ];
}
