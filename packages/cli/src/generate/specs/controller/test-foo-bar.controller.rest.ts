import { dependency, RestController } from '@foal/core';

import { TestFooBarCollection } from '../services';

export class TestFooBarController extends RestController {
  @dependency
  collection: TestFooBarCollection;
}
