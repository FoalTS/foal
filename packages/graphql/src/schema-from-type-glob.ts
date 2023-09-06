import { glob } from 'glob';
import { GraphQLSchema } from 'graphql';
import { schemaFromTypePaths } from './schema-from-type-paths';

/**
 * Build a GraphQL schema from several files containing the type definitions.
 *
 * @export
 * @param {string} pattern - A glob pattern describing the file paths.
 * @returns {Promise<GraphQLSchema>} The GraphQL schema.
 */
export async function schemaFromTypeGlob(pattern: string): Promise<GraphQLSchema> {
  const files = await glob(pattern, {});

  if (files.length === 0) {
    throw new Error(`No file found for the pattern "${pattern}".`);
  }

  return schemaFromTypePaths(...files);
}
