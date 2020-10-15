import { getConnection } from '@foal/typeorm/node_modules/typeorm';

export function closeTestConnection(): Promise<void> {
  return getConnection().close();
}
