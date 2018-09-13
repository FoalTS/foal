// 3p
import { controller } from '@foal/core';

export class MyModule {
  controllers = [
    controller('/', MyController),
    controller('/', MyController2)
  ];
}
