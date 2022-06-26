import { DataSource } from '@foal/typeorm/node_modules/typeorm';

export function createDataSource(): DataSource {
  return new DataSource({
    type: 'better-sqlite3',
    database: './test_db.sqlite',
    entities: ['build/app/**/*.entity.js'],
    migrations: ['build/migrations/*.js'],
  });
}

export const dataSource = createDataSource();