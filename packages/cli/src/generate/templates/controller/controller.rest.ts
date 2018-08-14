import { Controller, RestController } from '@foal/core';

import { /* upperFirstCamelName */Collection } from '../services//* kebabName */-collection.service';

@Controller()
export class /* upperFirstCamelName */Controller extends RestController {
  collectionClass = /* upperFirstCamelName */Collection;
}
