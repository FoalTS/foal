// 3p
import {} from 'somewhere';
import { TestFooBarController } from './controllers';
import { controller } from '@foal/core';

export class MyController {
  subControllers = [
    controller('/test-foo-bars', TestFooBarController)
  ];
}
