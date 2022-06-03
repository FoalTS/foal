// 3p
import { ServiceManager } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { createDataSource } from '../app/create-data-source';

export const schema = {
  additionalProperties: false,
  properties: {
    token: { type: 'string' }
  },
  required: [ 'token' ],
  type: 'object',
};

export async function main({ token }: { token: string }) {
  const dataSource = createDataSource();
  await dataSource.initialize();

  const services = new ServiceManager()
    .set('TYPEORM_DATA_SOURCE', dataSource);

  const store = services.get(TypeORMStore);
  await store.destroy(token);
}
