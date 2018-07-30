import { EntitySerializer, Service } from '@foal/core';

import { TestFooBar } from '../entities/test-foo-bar.entity';

@Service()
export class TestFooBarSerializer extends EntitySerializer {
  // tslint:disable-next-line:whitespace
  entityClass = TestFooBar;
}
