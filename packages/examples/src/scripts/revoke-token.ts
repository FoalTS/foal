// 3p
import { createService } from '@foal/core';
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

export async function main({ token }: { token: string }) {
  await dataSource.initialize();

  await createService(TypeORMStore).destroy(token);
}
