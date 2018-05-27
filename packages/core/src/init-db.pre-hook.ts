import { Connection, ConnectionOptions, createConnections } from 'typeorm';

import { Config } from './classes';
import { PreHook } from './interfaces';

export function initDB(): PreHook {
  let connections: Connection[];
  const config = new Config<{ databases: ConnectionOptions[] }>('base').config;
  return async () => {
    if (!connections) {
      connections = await createConnections(config.databases);
    }
  };
}
