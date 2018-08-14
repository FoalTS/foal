import { Controller, RestController } from '@foal/core';

import { TestFooBarCollection } from '../services/test-foo-bar-collection.service';

@Controller()
export class TestFooBarController extends RestController {
  collectionClass = TestFooBarCollection;
}
