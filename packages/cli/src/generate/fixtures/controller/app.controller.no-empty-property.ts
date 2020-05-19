// 3p
import { controller } from '@foal/core';

export class MyController {
  subControllers = [
    controller('/', MyController),
    controller('/', MyController2)
  ];
}
