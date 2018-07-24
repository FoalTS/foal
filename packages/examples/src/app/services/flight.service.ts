import { EntitySerializer, Service } from '@foal/core';

import { Flight } from '../entities';

@Service()
export class FlightService extends EntitySerializer<Flight> {
  entityClass = Flight;
}
