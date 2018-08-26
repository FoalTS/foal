import { Controller, RestController } from '@foal/core';

import { TestFooBarCollection } from '../services';

@Controller()
export class TestFooBarController extends RestController {
  collectionClass = TestFooBarCollection;
}
