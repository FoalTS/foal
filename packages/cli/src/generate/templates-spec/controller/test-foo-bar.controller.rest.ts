import { Controller, RestController } from '@foal/core';

import { TestFooBarSerializer } from '../services/test-foo-bar-serializer.service';

@Controller()
export class TestFooBarController extends RestController {
  serializerClass = TestFooBarSerializer;
}
