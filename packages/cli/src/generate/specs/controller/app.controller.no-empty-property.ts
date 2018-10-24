// 3p
import { controller } from '@foal/core';
import { TestFooBarController } from './controllers';

export class MyController {
  subControllers = [
    controller('/', MyController),
    controller('/', MyController2),
    controller('/test-foo-bar', TestFooBarController)
  ];
}
