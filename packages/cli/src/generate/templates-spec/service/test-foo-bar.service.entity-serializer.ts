import { EntityResourceCollection, Service } from '@foal/core';

import { TestFooBar } from '../entities/test-foo-bar.entity';

@Service()
export class TestFooBarSerializer extends EntityResourceCollection {
  // tslint:disable-next-line:whitespace
  entityClass = TestFooBar;
}
