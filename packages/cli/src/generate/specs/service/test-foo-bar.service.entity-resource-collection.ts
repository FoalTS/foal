import { EntityResourceCollection, middleware, Service, validate } from '@foal/core';

import { TestFooBar } from '../entities';

const schema = {
  additionalProperties: false,
  properties: {
    // To complete
  },
  required: [ /* To complete */ ],
  type: 'object',
};

export class TestFooBarCollection extends EntityResourceCollection {
  // tslint:disable-next-line:whitespace
  entityClass = TestFooBar;
  allowedOperations: EntityResourceCollection['allowedOperations'] = [
    'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById'
  ];

  middlewares = [
    middleware('create|modifyById|updateById', ({ data }) => validate(schema, data))
  ];
}
