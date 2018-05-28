import { Connection, ConnectionOptions, createConnections } from 'typeorm';

import { getConfig, PreHook } from '../../core';

export function initDB(): PreHook {
  let connections: Connection[];
  const config = getConfig('base') as { databases: ConnectionOptions[] };
  return async () => {
    if (!connections) {
      connections = await createConnections(config.databases);
    }
  };
}
