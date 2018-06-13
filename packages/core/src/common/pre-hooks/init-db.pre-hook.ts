import { ConnectionOptions, ConnectionOptionsReader, createConnection } from 'typeorm';

import { Class, PreHook } from '../../core';

export function initDB(entities: Class[] = [], connectionName = 'default'): PreHook {
  let connectionOptions: ConnectionOptions;
  return async () => {
    if (!connectionOptions) {
      const reader = new ConnectionOptionsReader({
        root: process.cwd()
      });
      connectionOptions = await reader.get(connectionName);
      await createConnection({
        ...connectionOptions,
        entities,
      });
    }
  };
}
