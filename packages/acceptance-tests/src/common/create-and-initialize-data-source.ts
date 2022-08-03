// 3p
import { DataSource } from 'typeorm';

// FoalTS
import { Class } from '@foal/core';

export async function createAndInitializeDataSource(
  entities: Class[],
  options: { dropSchema?: boolean, type?: 'mongodb'|'better-sqlite3', database?: string } = {}
): Promise<DataSource> {
  const dataSource = new DataSource({
    database: options.database ?? 'e2e_db.sqlite',
    dropSchema: options.dropSchema ?? true,
    entities,
    synchronize: true,
    type: options.type ?? 'better-sqlite3'
  });
  await dataSource.initialize();
  return dataSource;
}
