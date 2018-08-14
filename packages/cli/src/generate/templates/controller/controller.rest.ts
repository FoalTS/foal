import { Controller, RestController } from '@foal/core';

import { /* upperFirstCamelName */Serializer } from '../services//* kebabName */-serializer.service';

@Controller()
export class /* upperFirstCamelName */Controller extends RestController {
  collectionClass = /* upperFirstCamelName */Serializer;
}
