---
title: MongoDB
sidebar_label: MongoDB (TypeORM or Mongoose)
---

FoalTS provides two ways to interact with a MongoDB database in your application: [Mongoose](https://mongoosejs.com/) and [TypeORM](https://typeorm.io/#/).

## Usage with Mongoose

### Generating a new project with Mongoose

When creating an application with the `--mongodb` flag, the CLI generates a new project with `mongoose` and `@foal/mongoose` installed. The `User` model is defined using this ODM as well as the `create-user` script.

```
foal createapp my-app --mongodb
```

### Generating a model

You cannot create *entities* in a Mongoose project, as it is specific to TypeORM. Instead, you can use this command to generate a new model:

```
foal g model <name>
```

### Configuration

The URI of the MongoDB database can be passed through:
- the config file `config/default.json` with the `mongodb.uri` key,
- or with the environment variable `MONGODB_URI`.

*Example (`config/default.json`)*:
```json
{
  ...
  "mongodb": {
    "uri": "mongodb://localhost:27017/db"
  }
}
```

### Authentication

#### The `MongoDBStore`

```
npm install @foal/mongodb
```

If you use sessions with `@TokenRequired` or `@TokenOptional`, you must use the `MongoDBStore` from `@foal/mongodb`.

#### The `fetchUser` function

*Example with JSON Web Tokens*:
```typescript
import { JWTRequired } from '@foal/jwt';
import { fetchUser } from '@foal/mongoose';

import { User } from '../models';

@JWTRequired({ user: fetchUser(User) })
class MyController {}
```

## Usage with TypeORM

```
npm uninstall sqlite3
npm install mongodb
```

### Configuration

*ormconfig.js*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: "mongodb",
  database: Config.get2('database.database', 'string'),
  dropSchema: Config.get2('database.dropSchema', 'boolean', false),
  entities: ["build/app/**/*.entity.js"],
  host: Config.get2('database.host', 'string'),
  port: Config.get2('database.port', 'number'),
  synchronize: Config.get2('database.synchronize', 'boolean', false)
}

```


*config/default.json*
```json
{
  "database": {
    "database": "mydb",
    "host": "localhost",
    "port": 27017
  }
}
```

### Authentication

#### The `MongoDBStore`

```
npm install @foal/mongodb
```

If you use sessions with `@TokenRequired` or `@TokenOptional`, you must use the `MongoDBStore` from `@foal/mongodb`. **The TypeORMStore does not work with noSQL databases.**

#### The `fetchMongoDBUser` function

*user.entity.ts*
```typescript
import { Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
export class User {

  @ObjectIdColumn()
  id: ObjectID;

}
```

*Example with JSON Web Tokens*:
```typescript
import { JWTRequired } from '@foal/jwt';
import { fetchMongoDBUser } from '@foal/typeorm';

import { User } from '../entities';

@JWTRequired({ user: fetchMongoDBUser(User) })
class MyController {}
```

## Limitations

When using MongoDB, there are some features that are not available:
- the `foal g rest-api <name>` command,
- and the *Groups & Permissions* system.