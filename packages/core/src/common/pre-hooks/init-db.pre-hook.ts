import { ConnectionOptions, createConnection, getConnectionOptions } from 'typeorm';

import { Class, PreHook } from '../../core';

export function initDB(entities: Class[] = []): PreHook {
  let connectionOptions: ConnectionOptions;
  return async () => {
    if (!connectionOptions) {
      connectionOptions = await getConnectionOptions();
      await createConnection({
        ...connectionOptions,
        entities,
      });
    }
  };
}
