import { ConnectionOptions, ConnectionOptionsReader, createConnection } from 'typeorm';

import { Class, Hook, HookDecorator } from '../../core';

export function initDB(entities: Class[] = [], connectionName = 'default'): HookDecorator {
  let connectionOptions: ConnectionOptions;
  return Hook(async () => {
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
  });
}
