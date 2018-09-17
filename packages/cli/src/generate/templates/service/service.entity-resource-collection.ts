import { EntityResourceCollection, middleware, validate } from '@foal/core';

import { /* upperFirstCamelName */ } from '../entities';

const schema = {
  additionalProperties: false,
  properties: {
    // To complete
  },
  required: [ /* To complete */ ],
  type: 'object',
};

export class /* upperFirstCamelName */Collection extends EntityResourceCollection {
  // tslint:disable-next-line:whitespace
  entityClass = /* upperFirstCamelName */;
  allowedOperations: EntityResourceCollection['allowedOperations'] = [
    'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById'
  ];

  middlewares = [
    middleware('create|modifyById|updateById', ({ data }) => validate(schema, data))
  ];
}
