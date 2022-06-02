// 3p
import { DataSource } from '@foal/typeorm/node_modules/typeorm';

// FoalTS
import { Class } from '@foal/core';

export function createTestDataSource(entities: Class[], name?: string): DataSource {
  return new DataSource({
    database: 'e2e_db.sqlite',
    dropSchema: true,
    entities,
    synchronize: true,
    type: 'better-sqlite3',
    name
  });
}
