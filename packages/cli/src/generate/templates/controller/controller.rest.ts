import { dependency, RestController } from '@foal/core';

import { /* upperFirstCamelName */Collection } from '../services';

export class /* upperFirstCamelName */Controller extends RestController {
  @dependency
  collection: /* upperFirstCamelName */Collection;
}
