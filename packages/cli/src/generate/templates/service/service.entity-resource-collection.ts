import { EntityResourceCollection, Service } from '@foal/core';

import { /* upperFirstCamelName */ } from '../entities';

@Service()
export class /* upperFirstCamelName */Collection extends EntityResourceCollection {
  // tslint:disable-next-line:whitespace
  entityClass = /* upperFirstCamelName */;
  allowedOperations: EntityResourceCollection['allowedOperations'] = [
    'create', 'findById', 'find', 'modifyById', 'updateById', 'deleteById'
  ];
}
