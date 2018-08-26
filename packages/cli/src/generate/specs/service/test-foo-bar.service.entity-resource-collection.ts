import { EntityResourceCollection, Service } from '@foal/core';

import { TestFooBar } from '../entities';

@Service()
export class TestFooBarCollection extends EntityResourceCollection {
  // tslint:disable-next-line:whitespace
  entityClass = TestFooBar;
  allowedOperations: EntityResourceCollection['allowedOperations'] = [
    'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById'
  ];
}
