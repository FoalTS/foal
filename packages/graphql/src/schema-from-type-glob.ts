import * as glob from 'glob';
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
  return new Promise<GraphQLSchema>((resolve, reject) => {
    glob(pattern, {}, (err, files) => {
      if (err) {
        return reject(err);
      }
      if (files.length === 0) {
        return reject(new Error(`No file found for the pattern "${pattern}".`));
      }
      resolve(schemaFromTypePaths(...files));
    });
  });
}
