---
title: GraphQL
---

[GraphQL](https://graphql.org/) is a query language for APIs. Unlike traditional REST APIs, GraphQL APIs have only one endpoint to which requests are sent. The content of the request describes all the operations to be performed and the data to be returned in the response. Many resources can be retrieved in a single request and the client gets exactly the properties it asks for.

*Example of request*
```graphql
{
  project(name: "GraphQL") {
    tagline
  }
}
```

*Example of response*
```json
{
  "data": {
    "project": {
      "tagline": "A query language for APIs"
    }
  }
}
```

> The below document assumes that you have a basic knowledge of GraphQL.

To use GraphQL with FoalTS, you need to install the packages `graphql` and `@foal/graphql`. The first one is maintained by the GraphQL community and parses and resolves queries. The second is specific to FoalTS and allows you to configure a controller compatible with common GraphQL clients ([graphql-request](https://www.npmjs.com/package/graphql-request), [Apollo Client](https://www.apollographql.com/docs/react/), etc), load type definitions from separate files or handle errors thrown in resolvers.

```bash
npm install graphql@15 @foal/graphql
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

And here is an example of what your client code might look like:
```typescript
import { request } from 'graphql-request';

const data = await request('/graphql', '{ hello }');
// data equals "{ hello: 'Hello world!' }"
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
import { join } from 'path';

export class ApiController extends GraphQLController {
  schema = schemaFromTypeGlob(join(__dirname, '**/*.graphql'));
  // ...
}
```

Note that for this to work, you must copy the graphql files during the build. To do this, you need to install the `copy` package and update some commands of your `package.json`.

```
npm install cpx2  --save-dev
```

```json
{
  "scripts": {
    "build": "foal rmdir build && cpx \"src/**/*.graphql\" build && tsc -p tsconfig.app.json",
    "dev": "npm run build && concurrently \"cpx \\\"src/**/*.graphql\\\" build -w\" \"tsc -p tsconfig.app.json -w\" \"supervisor -w ./build,./config -e js,json,yml,graphql --no-restart-on error ./build/index.js\"",
    "build:test": "foal rmdir build && cpx \"src/**/*.graphql\" build && tsc -p tsconfig.test.json",
    "test": "npm run build:test && concurrently \"cpx \\\"src/**/*.graphql\\\" build -w\" \"tsc -p tsconfig.test.json -w\" \"mocha --file ./build/test.js -w --watch-files build \\\"./build/**/*.spec.js\\\"\"",
    "build:e2e": "foal rmdir build && cpx \"src/**/*.graphql\" build && tsc -p tsconfig.e2e.json",
    "e2e": "npm run build:e2e && concurrently \"cpx \\\"src/**/*.graphql\\\" build -w\" \"tsc -p tsconfig.e2e.json -w\" \"mocha --file ./build/e2e.js -w --watch-files build \\\"./build/e2e/**/*.js\\\"\"",
    ...
  }
}
```

> Alternatively, if you want to specify only specific files instead of using a glob pattern, you can call `schemaFromTypePaths`.
> ```typescript
> import { GraphQLController, schemaFromTypePaths } from '@foal/graphql';
> import { join } from 'path';
>
> export class ApiController extends GraphQLController {
>   schema = schemaFromTypePaths(
>     join(__dirname, './query.graphql'),
>     join(__dirname, './user.graphql')
>   );
>   // ...
> }
> ```

## Using a Service for the Root Resolvers

Root resolvers can also be grouped into a service in order to benefit from all the advantages offered by services (dependency injection, etc.). All you have to do is add the `@dependency` decorator as you would with any service.

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

## GraphiQL

![GraphiQL](./images/graphiql.png)

You can generate a `GraphiQL` page with the `GraphiQLController` class by installing the following package.

```bash
npm install @foal/graphiql
```

*app.controller.ts*
```typescript
import { controller } from '@foal/core';
import { GraphiQLController } from '@foal/graphiql';

import { GraphqlApiController } from './services';

export class AppController {

  subControllers = [
    // ...
    controller('/graphql', GraphqlApiController),
    controller('/graphiql', GraphiQLController)
  ];

}
```

### Custom GraphiQL Options

Most [GraphiQL options](https://github.com/graphql/graphiql/tree/main/packages/graphiql#props) are supported and can be provided by inheriting the `GraphiQLController` class.

```typescript
import { GraphiQLController, GraphiQLControllerOptions } from '@foal/graphiql';

export class GraphiQL2Controller extends GraphiQLController {
  options: GraphiQLControllerOptions = {
    docExplorerOpen: true,
  }
}

```

### Custom API endpoint

By default, the GraphiQL page assumes that the GraphiQL API is located at `/graphql`. This behavior can be overridden with the `apiEndpoint` property.

```typescript
import { GraphiQLController, GraphiQLControllerOptions } from '@foal/graphiql';

export class GraphiQL2Controller extends GraphiQLController {
  apiEndpoint = '/api';
}

```

### Custom CSS theme

In order to change the page theme, the controller class allows you to include custom CSS files.

```typescript
import { GraphiQLController, GraphiQLControllerOptions } from '@foal/graphiql';

export class GraphiQL2Controller extends GraphiQLController {
  cssThemeURL = 'https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.23.0/theme/solarized.css';

  options: GraphiQLControllerOptions = {
    editorTheme: 'solarized light'
  }
}

```

## Error Handling - Masking & Logging Errors

By default, GraphQL returns all errors thrown (or rejected) in the resolvers. However, this behavior is often not desired in production as it could cause sensitive information to leak from the server.

In comparison with REST APIs, when the [configuration key](../architecture/configuration.md)  `settings.debug` does not equal `true` (production case), details of the errors thrown in controllers are not returned to the client. Only a `500 - Internal Server Error` error is sent back.

In a similar way, FoalTS provides two utilities `formatError` and `@FormatError` for your GraphQL APIs to log and mask errors.  When `settings.debug` is `true`, the errors are converted into a new one whose unique message is `Internal Server Error`.

*Example of GraphQL response in production*
```json
{
  "data": { "user": null },
  "errors": [
    {
      "locations": [ { "column": 2, "line": 1 } ],
      "message": "Internal Server Error",
      "path": [ "user" ]
    }
  ]
}
```

Here are examples on how to use `formatError` and `@FormatError`.

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

> Note that `formatError` and `@FormatError` make your functions become asynchronous. This means that any value returned by the function is now a resolved promise of this value, and any errors thrown in the function is converted into a rejected promise. This only has an impact on unit testing as you may need to preceed your function calls by the keyword `await`.

`formatError` and `@FormatError` also accept an optional parameter to override its default behavior. It is a function that takes the error thrown or rejected in the resolver and return the error that must be sent to the client. It may be asynchronous or synchronous.

By default, this function is:
```typescript
function maskAndLogError(err: any): any {
  console.log(err);

  if (Config.get('settings.debug', 'boolean')) {
    return err;
  }

  return new Error('Internal Server Error');
}
```

But we can also imagine other implementations such as:
```typescript
import { reportErrorTo3rdPartyService } from 'somewhere';

async function maskAndLogError(err: any): Promise<any> {
  console.log(err);

  try {
    await reportErrorTo3rdPartyService(err);
  } catch (error: any) {}

  if (err instanceof MyCustomError) {
    return err;
  }

  if (Config.get('settings.debug', 'boolean')) {
    return err;
  }

  return new Error('Internal Server Error');
}
```

## Authentication & Authorization

> The below code is an example of managing authentication and authorization with a GraphQL controller.

*api.controller.ts*
```typescript
import { GraphQLController } from '@foal/graphql';
import { JWTRequired } from '@foal/jwt';
import { buildSchema } from 'graphql';

import { User } from '../entities';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const root = {
  hello: (_, context) => {
    if (!context.user.isAdmin) {
      return null;
    }
    return 'Hello world!';
  },
};

@JWTRequired({ user: (id: number) => User.findOneBy({ id }) })
export class ApiController extends GraphQLController {
  schema = schema;
  resolvers = root;
}
```

## Using TypeGraphQL


:::info

TypeGraphQL requires version 15 of the `graphql` package:

```bash
npm install graphql@15
```

:::

> *[TypeGraphQL](https://typegraphql.com/) is a library that allows you to create GraphQL schemas and resolvers with TypeScript classes and decorators.*

You can use TypeGraphQL by simply calling its `buildSchema` function.

*Example*
```typescript
import { GraphQLController } from '@foal/graphql';
import { buildSchema, Field, ObjectType, Query, Resolver } from 'type-graphql';

@ObjectType()
class Recipe {
  @Field()
  title: string;
}

@Resolver(Recipe)
class RecipeResolver {

  @Query(returns => Recipe)
  async recipe() {
    return {
      title: 'foobar'
    };
  }

}

export class ApiController extends GraphQLController {
  schema = buildSchema({
    resolvers: [ RecipeResolver ]
  });
}
```

## Advanced

### Override the Resolver Context

The *GraphQL context* that is passed to the resolvers is by default the *request context*. This behavior can be changed by overriding the `getResolverContext` method.

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
