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

  const sessionID = Session.verifyTokenAndGetId(token);
  if (!sessionID) {
    console.log('Invalid token');
    return;
  }

  await createService(TypeORMStore).destroy(sessionID);
}
