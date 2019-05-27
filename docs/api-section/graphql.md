# GraphQL

[GraphQL](https://graphql.org/) is a query language for APIs. Unlike traditional REST APIs, GraphQL APIs have only one endpoint to which requests are sent. The content of the request describes all the operations to be performed and the data to be returned in the response. Many resources can be retrieved in a single request and the client gets exactly the properties it asks for.

> The below document assumes that you have a basic knowledge of GraphQL.

To use GraphQL with FoalTS, you need to install the packages `graphql` and `@foal/graphql`. The first one is maintained by the GraphQL community and parses and resolves queries. The second is specific to FoalTS and allows you to configure a controller compatible with common GraphQL clients ([graphql-request](https://www.npmjs.com/package/graphql-request), [Apollo Client](https://www.apollographql.com/docs/react/), etc), load type definitions from separate files or handle errors thrown in resolvers.

```
npm install graphql @foal/graphql
```

## Basic Usage

The main component of the package is the abstract `GraphQLController`. Inheriting this class allows you to create a controller that is compatible with common GraphQL clients ([graphql-request](https://www.npmjs.com/package/graphql-request), [Apollo Client](https://www.apollographql.com/docs/react/), etc) or any client that follows the HTTP specification defined [here](https://graphql.org/learn/serving-over-http/).

Here is an example on how to use it with a simple schema and resolver.

*app.controller.ts*
```typescript
export class AppController {
  subControllers = [
    controller('/graphql', ApiController)
  ]
}
```

*api.controller.ts*
```typescript
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

export class ApiController extends GraphQLController {
  schema = schema;
  resolvers = root;
}
```

Alternatively, if you have several strings that define your GraphQL types, you can use the `schemaFromTypeDefs` function to build the schema.

```typescript
import { GraphQLController, schemaFromTypeDefs } from '@foal/graphql';

const source1 = `
  type Query {
    me: User
  }
`;
const source2 = `
  type User {
    id: ID
    name: String
  }
`;

// ...

export class ApiController extends GraphQLController {
  schema = schemaFromTypeDefs(source1, source2);
  // ...
}

```

## Using Separate Files for Type Definitions

If you want to specify type definitions in separate files, you can use the `schemaFromTypeGlob` function for this.

*Example*
```
src/
'- app/
  '- controllers/
    |- query.graphql
    |- user.graphql
    '- api.controller.ts
```

*query.graphql*
```graphql
type Query {
  me: User
}
```

*user.graphql*
```graphql
type User {
  id: ID
  name: String
}
```

*api.controller.ts*
```typescript
import { GraphQLController, schemaFromTypeGlob } from '@foal/graphql';

export class ApiController extends GraphQLController {
  schema = schemaFromTypeGlob('./src/app/**/*.graphql');
  // ...
}
```

Note that for this to work, you must copy the graphql files during building. To do this, you can update some lines of your `package.json` as follows:

```json
{
  ...
  "scripts": {
    ...
    "build:app": "copy-cli \"src/**/*.html\" build && copy-cli \"src/**/*.graphql\" build && tsc -p tsconfig.app.json",
    ...
    "build:test": "copy-cli \"src/**/*.html\" build && copy-cli \"src/**/*.graphql\" && tsc -p tsconfig.test.json",
    ...
    "build:e2e": "copy-cli \"src/**/*.html\" build && copy-cli \"src/**/*.graphql\" && tsc -p tsconfig.e2e.json"
    ...
  }
}
```

> Alternatively, if you want to specify only specific files instead of using a glob pattern, you can use `schemaFromTypePaths`.
> ```typescript
> import { GraphQLController, schemaFromTypePaths } from '@foal/graphql';
>
> export class ApiController extends GraphQLController {
>   schema = schemaFromTypePaths(
>     './src/app/controllers/query.graphql',
>     './src/app/controllers/user.graphql'
>   );
>   // ...
> }
> ```

## Using a Service for the Root Resolvers

It is also possible to group the root resolvers into a service and thus benefit from all the advantages that services offer (dependency injection, etc). All you have to do is add the `@dependency` decorator as you would with any service.

*api.controller.ts*
```typescript
import { dependency } from '@foal/core';
import { GraphQLController } from '@foal/graphql';
import { RootResolverService } from '../services';

// ...

export class ApiController extends GraphQLController {
  schema = // ...

  @dependency
  resolvers: RootResolverService;
}
```

*root-resolver.service.ts*
```typescript
export class RootResolverService {

  hello() {
    return 'Hello world!';
  }

}
```

## GraphQL Playground

Next releases of FoalTS will include support for [GraphiQL](https://github.com/graphql/graphiql).

## Error Handling - Masking & Logging Errors

By default, GraphQL returns all errors thrown (or rejected) in the resolvers. However, this behavior may not be desired in production as it could cause sensitive information to leak from the server.

For comparison, when the [configuration key](../deployment-and-environments/configuration.md) `settings.debug` is not true (production case), REST APIs returns a `500 - Internal Server Error` without details of the error.

In a similar way, FoalTS provides a function `formatError` and a decorator `@FormatError` for your GraphQL APIs to log errors and mask them when `settings.debug` is not true.

Here are examples on how to use them.

```typescript
function user() {
  // ...
}

const resolvers = {
  user: formatError(user)
}
```

```typescript
class ResolverService {
  @FormatError()
  user() {
    // ...
  }
}
```

> `formatError` and `@FormatError`. Promises. Testability

Override `maskAndLogError`

## Authentication & Authorization

The below example shows how to authenticate a user with 

## Advanced

### Override the Resolver Context

The *GraphQL context* that is passed to the resolvers is by default the *request context*. The behavior can be changed by overriding the `getResolverContext` method.

```typescript
import { Context } from '@foal/core';
import { GraphQLController } from '@foal/graphql';

export class ApiController extends GraphQLController {
  // ...

  getResolverContext(ctx: Context) {
    return { user: ctx.user };
  }
}
```