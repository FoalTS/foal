// 3p
import { Connection, createConnection } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import { Class } from '@foal/core';

export function createTestConnection(
  entities: Class[],
  options: { dropSchema?: boolean, type?: 'mongodb'|'better-sqlite3', database?: string } = {}
): Promise<Connection> {
  return createConnection({
    database: options.database ?? 'e2e_db.sqlite',
    dropSchema: options.dropSchema ?? true,
    entities,
    synchronize: true,
    type: options.type ?? 'better-sqlite3'
  });
}
