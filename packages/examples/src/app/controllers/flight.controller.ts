import { Controller, RestController } from '@foal/core';

import { FlightService } from '../services';

@Controller()
export class FlightController extends RestController {
  serializerClass = FlightService;
}
