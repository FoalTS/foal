// 3p
import { MyController, MyController2, TestFooBarController } from './api';
import { controller } from '@foal/core';

export class ApiController {
  subControllers = [
    controller('/', MyController),
    controller('/', MyController2),
    controller('/test-foo-bars', TestFooBarController)
  ];
}
