/*
Because of the way lerna and npm manage dependencies, we must add this file to use TypeORM store.
*/

export { TypeORMStore as ConcreteSessionStore } from '@foal/typeorm';

export function getTypeORMStorePath(): string {
  return './../lib/common/typeorm-store';
}
