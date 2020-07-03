// 3p
import { createService, Session } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { createConnection } from '@foal/typeorm/node_modules/typeorm';

export const schema = {
  additionalProperties: false,
  properties: {
    token: { type: 'string' }
  },
  required: [ 'token' ],
  type: 'object',
};

export async function main({ token }: { token: string }) {
  await createConnection(require('../../ormconfig.json'));
  await createService(TypeORMStore).destroy(token);
}
