import { Connection, ConnectionOptions, createConnection } from 'typeorm';

import { Class, getConfig, PreHook } from '../../core';

export function initDB(entities: Class[] = []): PreHook {
  let connection: Connection;
  const config = getConfig('base') as { database: ConnectionOptions };
  return async () => {
    if (!connection) {
      connection = await createConnection({
        ...config.database,
        entities
      });
    }
  };
}
