// 3p
import { MyController, MyController2 } from './api';

export class ApiController {
  subControllers = [
    controller('/', MyController),
    controller('/', MyController2),
  ];
}
