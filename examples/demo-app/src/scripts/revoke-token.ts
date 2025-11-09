// 3p
import { ServiceManager } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

// App
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    token: { type: 'string' }
  },
  required: [ 'token' ],
  type: 'object',
};

export async function main({ token }: { token: string }, services: ServiceManager) {
  await dataSource.initialize();

  await services.get(TypeORMStore).destroy(token);
}
