import { ModelService, Service } from '@foal/core';

import { Flight } from '../models';

@Service()
export class FlightService extends ModelService<Flight> {
  Entity = Flight;
}
