import { Handler, HttpResponseOK } from '@foal/core';

export const getAirport: Handler = ctx => {
  return new HttpResponseOK({ name: 'JFK' });
};
