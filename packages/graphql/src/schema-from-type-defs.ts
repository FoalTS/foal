//
import { buildSchema } from 'graphql';

export function schemaFromTypeDefs(...sources: string[]): object {
  return buildSchema(sources.reduce((source1, source2) => `${source1} ${source2}`));
}
