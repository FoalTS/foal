import { Controller, RestController } from '@foal/core';

import { FlightSerializer } from '../services';

@Controller()
export class FlightController extends RestController {
  serializerClass = FlightSerializer;
}
