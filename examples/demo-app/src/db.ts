import { DataSource } from 'typeorm';

export function createDataSource(): DataSource {
  return new DataSource({
    type: 'sqlite',
    database: './test_db.sqlite',
    entities: ['build/app/**/*.entity.js'],
    migrations: ['build/migrations/*.js'],
  });
}

export const dataSource = createDataSource();