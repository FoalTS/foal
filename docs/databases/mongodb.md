# MongoDB (noSQL)

## Creating a new project

To generate a new project that uses MongoDB, run the command `createapp` with the flag `--mongodb`.

```
foal createapp my-app --mongodb
```

## Configuration

*ormconfig.js*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: "mongodb",
  database: Config.get('database.database', 'string'),
  dropSchema: Config.get('database.dropSchema', 'boolean', false),
  entities: ["build/app/**/*.entity.js"],
  host: Config.get('database.host', 'string'),
  port: Config.get('database.port', 'number'),
  synchronize: Config.get('database.synchronize', 'boolean', false)
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

## Defining Entities and Columns

> More documentation here: https://github.com/typeorm/typeorm/blob/master/docs/mongodb.md.

The definition of entities and columns is the same as in relational databases, except that the ID type must be an `ObjectID` and the column decorator must be `@ObjectIdColumn`.

```typescript
import { Entity, ObjectID, ObjectIdColumn, Column } from 'typeorm';

@Entity()
export class User {
    
    @ObjectIdColumn()
    id: ObjectID;
    
    @Column()
    firstName: string;
    
    @Column()
    lastName: string;
    
}
```

## Authentication

### The `fetchMongoDBUser` function

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


### The `MongoDBStore`

```
npm install @foal/mongodb
```

If you use sessions with `@TokenRequired` or `@TokenOptional`, you must use the `MongoDBStore` from `@foal/mongodb`. **The `TypeORMStore` does not work with noSQL databases.**

## Limitations

When using MongoDB, there are some features that are not available:
- the `foal g rest-api <name>` command,
- and the *Groups & Permissions* system.

