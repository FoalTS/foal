import { EntitySerializer, Service } from '@foal/core';

import { Flight } from '../entities';

@Service()
export class FlightSerializer extends EntitySerializer {
  entityClass = Flight;
}
