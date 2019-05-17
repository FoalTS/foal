import { readFile } from 'fs';
import { promisify } from 'util';
import { schemaFromTypeDefs } from './schema-from-type-defs';

export async function schemaFromTypePaths(...paths: string[]): Promise<object> {
  const files = await Promise.all(
    paths.map(path => promisify(readFile)(path, 'utf8'))
  );
  return schemaFromTypeDefs(...files);
}
