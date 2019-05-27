import { readFile } from 'fs';
import { promisify } from 'util';
import { schemaFromTypeDefs } from './schema-from-type-defs';

/**
 * Build a GraphQL schema from several files containing the type definitions.
 *
 * @export
 * @param {...string[]} paths - The path of the files.
 * @returns {Promise<object>} The GraphQL schema.
 */
export async function schemaFromTypePaths(...paths: string[]): Promise<object> {
  const files = await Promise.all(
    paths.map(path => promisify(readFile)(path, 'utf8'))
  );
  return schemaFromTypeDefs(...files);
}
