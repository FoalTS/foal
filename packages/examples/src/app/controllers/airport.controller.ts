import { Controller, Get, HttpResponseOK } from '@foal/core';

@Controller()
export class AirportController {

  @Get()
  getAirport() {
    return new HttpResponseOK({ name: 'JFK' });
  }

}
