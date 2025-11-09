import { GraphQLController } from '@foal/graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: () => {
    return 'Hello world!';
  },
};

export class GraphqlApiController extends GraphQLController {
  schema = schema;
  resolvers = root;
}
