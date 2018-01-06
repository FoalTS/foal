# @foal/sequelize

## Prerequisities 

```typescript
npm install --save express @foal/core @foal/express @foal/sequelize

# And one of the following:
$ npm install --save pg@6 pg-hstore
$ npm install --save mysql2
$ npm install --save sqlite3
$ npm install --save tedious // MSSQL
```

## Setting up a connection

```typescript
import { Service } from '@foal/core';
import { SequelizeConnectionService } from '@foal/sequelize';

@Service()
export class Connection extends SequelizeConnectionService {
  constructor() {
    super('postgres://user:pass@example.com:5432/dbname');
  }
}
```

## Get connected to a table

```typescript
import { Service } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { Connection } from './connection.service';

@Service()
export class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }
}
```

## Serve your service as an API (optional)

```typescript
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { getCallback } from '@foal/express';
import { rest } from '@foal/common';
import { Foal } from '@foal/core';

import { Connection } from './connection.service';
import { User } from './user.service';

const foal = new Foal({
  controllers: [ rest.attachService('/users', User) ]
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(getCallback(foal));
app.listen(3000, () => console.log('Listening...'));
```

## Restriction

Let's say that we want to forbid to use the method `delete` when using the service as a controller.

```typescript
import { methodNotAllowed } from '@foal/common';
import { Service, ObjectType } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { Connection } from './connection.service';

@Service()
export class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }

  @methodNotAllowed()
  public delete(id: any, query: ObjectType): Promise<any> {
    return super.delete(id, query);
  }
}
```

## Extending methods

Let's say that we want to return all the users when updating one.

```typescript
import { Service, ObjectType } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { Connection } from './connection.service';

@Service()
export class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }

  public async update(id: any, data: any, query: ObjectType): Promise<any> {
    await super.update(id, data, params);
    return this.getAll({})
  }
}
```

## Testing

If you have overrided some methods and want to test them, you can do it with a fake DB thanks to the injection of the connection.

```typescript
import { Connection } from './connection.service';
import { User } from './user.service';

const userService = new User(new Connection('myFakeDBURI'));

// Then test userService as a mere service.
```