---
title: Update Guide to Version 3
sidebar_label: To v3
---

This guide will take you step by step through the upgrade to version 3. If something is missing or incorrect, feel free to submit an issue or a PR on Github.

## Contents

- What's new in version 3?
- Prerequisites
- Supported versions
- Configuration
- CLI
- Validation
- File upload
- Database
- Authentication and contexts
- Access control
- GraphQL
- Miscellaneous

## What's new in version 3?

Between version 2 and version 3, some parts of the framework have been improved and some new features have been added. Here are the notable improvements:
- all dependencies that Foal relies on have been updated, including TypeORM,
- the framework offers more advanced and secure typing,
- some features have been simplified,
- some bugs have been fixed,
- packages are smaller in size,
- and some parts of the framework are less tied to TypeORM to make it easier to use another ORM.

## Prerequisites

First, upgrade to the latest minor release of version 2 and check that everything is working properly.

## Supported versions

| Supported node versions | TS min version |
| --- | --- |
| 16.x, 18.x | 4.7 |

 The framework requires at least version 4.7 of TypeScript. When upgrading from v4.0, there are usually two things to do:
 - Add an `any` type in all `catch(error)` (i.e they become `catch(error: any)`)
 - Add a returned type to the `new Promise`: `new Promise<void>(...)`.

## Configuration

- **If you upgrade to TypeORM@0.3, use Prisma or any other dependency that calls the `dotenv` library under the hood, you won't be able to use custom `.env` files such as `.env.production` and `.env.local`.**
- If the same variable is provided both as environment variable and in the `.env` file, now the value of the environment variable is used.
- `undefined` values do not override other defined config values anymore. See [issue #1071](https://github.com/FoalTS/foal/issues/1071).

## CLI

- In new projects, the `npm run develop` command has been renamed to `npm run dev` to be consistent with the JS ecosystem.
- Generated entities extend `BaseEntity` by default to not use `connection.getRepository`.
- REST generated files use `BaseEntity` methods to facilitate the use of other ORMs.
- Generated scripts do not include TypeORM code to make it make it easier to use other ORM.
- The `foal g vscode-config` has been removed to not make the framework code dependent on an IDE. Documentation on how to configure VSCode with Foal has been added though.

## Validation

### Validation with JSON schemas

[AJV](https://ajv.js.org/) dependency has been upgraded to version 8, which allows us to take advantage of its TypeScript types. In particular, it is now possible to link a JSON schema with an interface:

```typescript
import { JSONSchemaType } from 'ajv';

interface MyData {
  foo: number;
  bar?: string
}

const schema: JSONSchemaType<MyData> = {
  type: 'object',
  properties: {
    foo: { type: 'integer' },
    bar: { type: 'string', nullable: true }
  },
  required: ['foo'],
  additionalProperties: false
}
```

As this is a major upgrade of the library, there are some breaking changes in the results returned by the validation function which is used by `ValidateQueryParam`, `ValidatePathParam`, `ValidateHeader`, `ValidateCookie`, `ValidateBody`, `ValidatePayload`, `GraphQLController` and `ValidateMultipartFormDataBody` (renamed to `ParseAndValidateFiles`).

Here are the more notable payload changes:

| AJV version 6 | AJV version 8 |
| --- | --- |
| ``"dataPath": ".price"`` | `"instancePath": "/price"` |
| `"dataPath": "['a-number']"` | `"instancePath": "a-number"` |
| `message: 'should have required property \'name\''` | `message: 'must have required property \'name\''` |


Note also that:
- The option `'settings.ajv.nullable'` does not exist anymore.
- The configuration `'settings.ajv.useDefaults'` does not accept `'shared'` as allowed value anymore.
- As of AJV v8, the [strict mode](https://ajv.js.org/strict-mode.html) is added to *reduce the mistakes in JSON schemas and unexpected validation results*.
- More details can be found in [AJV migration guide](https://ajv.js.org/v6-to-v8-migration.html).

:::info

Note: `@ValidateXXX` hooks still take an `object` as argument. The typing of the parameter was difficult and AJV TS types are sometimes inconsistent with their corresponding JSON schemas. For example, a `foobar? : string` is converted to `{ type : 'string', nullable : true }` whereas `null` !== `undefined`. The choice was therefore made to let users use the `JSONSchemaType` themselves to type the argument if they wish.

:::

#### The `ajv-errors` plugin

If you're using the [ajv-errors](https://www.npmjs.com/package/ajv-errors) plugin, you will need to upgrade its version and update your code as follows:

```
npm install ajv-errors@3 ajv@8
```

```typescript
// Before
import * as ajvErrors from 'ajv-errors';
// After
import ajvErrors from 'ajv-errors';
```

### Validation with classes

- `@foal/typestack` require version `~0.5.1` of `class-transformer` and version `~0.13.2` of `class-validator`.

## File upload

The hook for uploading files has been updated so as to:
- support optional fields,
- make its parameters less verbose,
- remove the very large number of nested objects to access the files and fields from the `ctx`,
- have a better and safer typing,
- return an error to the client when multiple files are uploaded whereas we expect a single one,
- and make the hook name more meaningful to people not knowing multipart requests.

Here are the breaking changes and new features:
- `ValidateMultipartFormDataBody` is renamed to `ParseAndValidateFiles`.
- The interface of the hook has changed and accepts optional fields:
    ```typescript
    @ParseAndValidateFiles(
      {
        profile: { required: true }
      },
      // The second parameter is optional
      // and is used to add fields. It expects an AJV object.
      {
        type: 'object',
        properties: {
          description: { type: 'string' }
        },
        required: ['description'],
        additionalProperties: false
      }
    )
    ```
- `Context` has a new property `files` which has two methods `push` and `get`.
- The access to the fields and files in the controller method has changed:
    ```typescript
    // Before
    const name = ctx.request.body.fields.name;
    const file = ctx.request.body.files.avatar as File;
    const files = ctx.request.body.files.images as File[];

    // After
    const name = ctx.request.body.name;
    const file = ctx.files.get('avatar')[0];
    const files = ctx.files.get('images');
    ```
- Previously `saveTo: ''` was regarded as an upload with buffer and is saved as file in v3.
- `File` is exported from `@foal/core` and not `@foal/storage` anymore.
- New error `MULTIPLE_FILES_NOT_ALLOWED`.
- All `Disk.write` methods take a `Readable` as parameter and not a `NodeJS.ReadableStream` anymore.

### AWS S3

- The AWS region must be provided to connect to S3. One way to achieve this is to use the configuration key `settings.aws.region`.

## Databases

### TypeORM (all databases)

**Foal v3 now supports the latest version of TypeORM (v0.3)**. This version has some breaking changes with v0.2 which requires some changes to be made:

- `createConnection` has been deprecated in favor of `new DataSource`. There is no more global connection and the `DataSource` instance must be passed everywhere (unless you extend your entities from `BaseEntity`).
    ```typescript
    // Before
    const connection = await createConnection(opts);

    // After
    const dataSource = await DataSource(opts);
    await dataSource.initialize();
    ```
- As if it was no longer supported in v0.3, the `ormconfig.js` file has been removed. It is replaced by a new `src/db.ts` file with the following content. Whether you need to access the data source instance or create a new one, use this file.
    ```typescript
    import { Config } from '@foal/core';
    import { DataSource } from 'typeorm';

    export function createDataSource(): DataSource {
      return new DataSource({
        type: Config.getOrThrow('database.type', 'string') as any,

        url: Config.get('database.url', 'string'),
        host: Config.get('database.host', 'string'),
        port: Config.get('database.port', 'number'),
        username: Config.get('database.username', 'string'),
        password: Config.get('database.password', 'string'),
        database: Config.get('database.database', 'string'),

        dropSchema: Config.get('database.dropSchema', 'boolean', false),
        synchronize: Config.get('database.synchronize', 'boolean', false),

        entities: ['build/app/**/*.entity.js'],
        migrations: ['build/migrations/*.js'],
      });
    }

    export const dataSource = createDataSource();
    ```
- Migration commands have been updated accordingly:
    ```json
    {
      "makemigrations": "foal rmdir build && tsc -p tsconfig.app.json && npx typeorm migration:generate src/migrations/migration -d build/db -p && tsc -p tsconfig.app.json",
      "migrations": "npx typeorm migration:run -d build/db",
      "revertmigration": "npx typeorm migration:revert -d build/db"
    }
    ```
- In new projects (and in the documentation), the call of `createConnection` in in `app.controller.ts` has been replaced by a `dataSource.initilize()` in `src/index.ts`:
    ```typescript
    import { dataSource } from './db';

    async function main() {
      await dataSource.initialize();

      const app = await createApp(AppController);

      const port = Config.get('port', 'number', 3001);
      app.listen(port, () => displayServerURL(port));
    }
    ```
- If you need to create a connection in your tests (E2E or unit), import `createDataSource` from `db.ts` and initialize the connection. 
- If you use the methods `TypeORMStore.getSessionIDsOf` and `TypeORMStore.destroyAllSessionsOf`, they take the user ID as parameter and no longer the user object.
- The complete migration guide to `typeorm@0.3` can be found [here](https://github.com/typeorm/typeorm/releases/tag/0.3.0).

*Quick migration guide*

| TypeORM v0.2 | TypeORM v0.3 |
| --- | --- |
| `findOneOrFail` | `findOneByOrFail` |
| `findOne` | `findOneBy` |
| `find` | `findBy` |
| `undefined` (return value) | `null` |
| `find({ owner: ctx.user })` | `findBy({ owner: { id: ctx.user.id } })` |
| `findOne(1)` | `findOneBy({ id: 1 })` |
| `await createConnection(opts)` | `const dataSource = new DataSource(opts); await dataSource.initialize()` |
| `connection.close()` | `dataSource.destroy()` |
| `Foobar.findOneOrFail({}, { relations: ['permissions'] })` | `Foobar.findOneOrFail({}, { relations: { permissions: true } })` |

### redis

The `@foal/redis` package uses `redis@4` under the hood. If you used to pass a custom client to the redis store with `setRedisClient`, don't forget to update your dependency and call the new `.connect()` client method before injecting it.

```typescript
// Before
redisClient = createClient(REDIS_URI)
// After
redisClient = createClient({ url: REDIS_URI });
await redisClient.connect();
```

The same applies if you uses socket.io with redis (see Websockets documentation).

### MongoDB

The package `@foal/mongodb` and its Mongo store uses `mongodb@4`.
- You might need to upgrade `@types/node`. It is used under the hood by the library and you might face compilation errors otherwise.
- If you pass a custom Mongo client to the store, don't forget to upgrade your `mongodb` dependency to version 4.
    ```typescript
    // Before
    const mongoDBClient = await MongoClient.connect('mongodb://localhost:27017/db', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    // After
    const mongoDBClient = await MongoClient.connect('mongodb://localhost:27017/db');
    ```

**Important notes on the use of MongoDB with TypeORM:**
- TypeORM still requires `mongodb@3`. If you are using the MongoDB store, then you will have two connections established to the database. If you want to pass a custom client to the store, you can make the two versions coexist with the following code:
    ```json
    {
      "mongodb": "~3.7.3",
      "mongodb4": "npm:mongodb@~4.3.1",
    }
    ```
    
    ```typescript
    import { MongoClient } from 'mongodb4';
    ```
- TypeORM v0.3 works very badly with using the name `id` in entities. Consider to use `_id` instead:
  ```typescript
  import { ObjectId } from 'mongodb';

  @Entity()
  class Foobar {
      @ObjectIdColumn()
      // DO NO use
      id: ObjectID;
      // Use
      _id: ObjectID;
  }
  ```

  ```typescript
  // Before
  import { getMongoRepository } from 'typeorm';
  const user = await getMongoRepository(User).findOne('xxxx');

  // After
  import { ObjectId } from 'mongodb';
  const user = await User.findOneBy({ _id: new ObjectId('xxxx') });
  ```

## Authentication and contexts

### The `ctx.user` property

> These changes apply to both classes `Context` and `WebsocketContext`.

- **When the user is not authenticated, the value of `ctx.user` is now `null` and not `undefined`.** The motivation behind this change is to be as close as possible to the semantics of JavaScript and to be consistent with the `findOne` functions of the major ORMs (TypeORM@0.3, Prisma, Mikro-ORM, Mongoose).
- The default type of `ctx.user` is now `{ [key: string]: any } | null` and not `any`.

### The `ctx.session` property

> These changes apply to both classes `Context` and `WebsocketContext`.

- **When there is no session, the value of `ctx.session` is now `null` and not `undefined`.** See `ctx.user` for information.
- `ctx.session` is now always of type `Session | null`. As consequencies, the class `Context` takes only two generic type arguments: `User` and `ContextSession`.

```typescript
// Before
let ctx: Context<User, ContextSession, ContextState>;

// After
let ctx: Context<User, ContextState>;
```

```typescript
// Before
let ctx: Context<any, Session>;
ctx.session.set('foo', 'bar');

// After
let ctx: Context;
ctx.session!.set('foo', 'bar');
```

### The `ctx.state` property

> These changes apply to both classes `Context` and `WebsocketContext`.

- The default type of `ctx.state` is now `{ [key : string] : any }` and not `any`.

### The `fetchUser` functions

> These changes apply to the hooks `JWTRequired`, `JWTOptional` and `UseSessions`.

- The `FetchUser` interface and all `fetchUser`, `fetchMongoDBUser` and `fetchUserWithPermissions` functions have been removed. They were convulated functions that could make difficult the understanding of the hooks behavior at first glance.
- The `user` option in `@JWTxxx` and `@UseSessions` now expects a `(id: number) => Promise<{ [key: string]: any } | null>` by default. If the subject of a JWT (of type string) cannot be converted to a number, then an error is thrown. If the user ID must be a string then, you must add `userIdType: 'string'` to the options.
- To be consistent with the type of `ctx.user`, if the user cannot be authenticated, the hook `user` option must be given the `null` value.

```typescript
// Before
@UseSessions({ user: fetchUser(User) })

// After
@UseSessions({ user: (id: number) => User.findOneBy({ id }) })
```

```typescript
// Before
@UseSessions({ user: fetchUserWithPermissions(User) })

// After
@UseSessions({ user: (id: number) => User.findOneWithPermissionsBy({ id }) })
```

```typescript
// Before
@UseSessions({ user: fetchMongoDBUser(User) })

// After
import { ObjectId } from 'mongodb';
@UseSessions({
  user: (id: string) => User.findOneBy({ _id: new ObjectId(id) }),
  userIdType: 'string'
})
```

### The `userCookie` auth hook option

If you use the `userCookie` option, you may face type issues. Update your code as follows if necessary:

```typescript
// Before
{ userCookie: (ctx: Context<User|undefined>, services) => userToJSON(ctx.user) }
// After
{ userCookie: (ctx, services) => userToJSON(ctx.user as User|null) }
```

### Passwords

- The `@foal/password` package has been removed: the `isCommon` feature was very specific to native English speakers and therefore not very useful for other speakers. The package was also not used by the community (between 30 and 67 downloads per week).

### The `jwks-rsa` package

- The interface of the `options` argument in the `getRSAPublicKeyFromJWKS` hook has changed. See the [`jwks-rsa` library version 2](https://www.npmjs.com/package/jwks-rsa) options for more information.

## Access control

### Permissions

The `PermissionRequired` hook was closely tied to the TypeORM `UserWithPermissions` model making it difficult to use with another ORM.

As of version 3:
- The `PermissionRequired` hook has been moved to `@foal/core`.
- It can be used with any `ctx.user` implementing the `IUserWithPermissions` interface (exported in `@foal/core`).

## GraphQL

- `@foal/graphql` requires at least version `^15.8.0` of `graphql`.
- The returned values of `schemaFromTypePaths`, `schemaFromTypeDefs` and `schemaFromTypeGlob` are better typed as well as `GraphQLController.schema`.
- `GraphQLController.schema` is now typed with the interface `GraphQLSchema`. Same with all `schemaFrom*` functions.

## Miscellaneous

- The functions `escape` et `escapeProp` have been removed. Modern frontend frameworks (React, Angular, Vue, etc) already take care of escaping characters and these functions are easy to implement on one's own one.
- All Foal packages are compiled to `es2021` making packages smaller than before.
- Most properties of `Context`, `WebsocketContext` and `HttpResponse` are read-only.
- `DatabaseSession` now extends `BaseEntity`.
- `TypeORMStore.setConnection` and `TypeORMStore.close` do not exist anymore. Instead, use a different datasource when registering the `DatabaseSession` entity.
