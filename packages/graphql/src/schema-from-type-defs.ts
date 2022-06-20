//
import { buildSchema, GraphQLSchema } from 'graphql';

/**
 * Build a GraphQL schema from several sources.
 *
 * @export
 * @param {...string[]} sources - The type definitions.
 * @returns {GraphQLSchema} The GraphQL schema.
 */
export function schemaFromTypeDefs(...sources: string[]): GraphQLSchema {
  return buildSchema(sources.reduce((source1, source2) => `${source1} ${source2}`));
}
