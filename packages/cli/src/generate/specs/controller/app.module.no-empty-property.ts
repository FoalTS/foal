// 3p
import { controller } from '@foal/core';
import { TestFooBarController } from './controllers';

export class MyModule {
  controllers = [
    controller('/', MyController),
    controller('/', MyController2),
    controller('/', TestFooBarController)
  ];
}
