# @foal/sequelize

`@foal/sequelize` is a Foal integration of the ORM `Sequelize`. It lets you connect to a PostgreSQL or a MySQL database.

## Prerequisities 

```typescript
npm install --save express @foal/core @foal/express @foal/sequelize

# And one of the following:
$ npm install --save pg@6 pg-hstore # PostgreSQL
$ npm install --save mysql2 # MySQL
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
import { Sequelize, SequelizeModelService } from '@foal/sequelize';

import { Connection } from './connection.service';

export interface User {
  username: string;
}

@Service()
export class UserService extends SequelizeModelService<User> {
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
import { UserService } from './user.service';

const foal = new Foal({
  controllers: [ rest.attachService('/users', UserService) ]
});

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(getCallback(foal));
app.listen(3000, () => console.log('Listening...'));
```

## Restriction

Let's say that we want to forbid to use the method `findByIdAndRemove` when the service is used by a controller.

```typescript
import { methodNotAllowed } from '@foal/common';
import { Service, ObjectType } from '@foal/core';
import { Sequelize, SequelizeModelService } from '@foal/sequelize';

import { Connection } from './connection.service';

export interface User {
  username: string;
}

@Service()
export class UserService extends SequelizeModelService<User> {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }

  @methodNotAllowed()
  public findByIdAndRemove(id: string): Promise<void> {
    return super.findByIdAndRemove(id);
  }
}
```

## Extending methods

Let's say that we want to return all the users when updating one.

```typescript
import { Service, ObjectType } from '@foal/core';
import { DefaultIdAndTimeStamps, Sequelize, SequelizeModelService } from '@foal/sequelize';

import { Connection } from './connection.service';

export interface User {
  username: string;
}

@Service()
export class UserService extends SequelizeModelService<User> {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }

  public findByIdAndUpdate(id: string, data: Partial<User & DefaultIdAndTimeStamps>):
      Promise<(User & DefaultIdAndTimeStamps)[]> {
    await super.findByIdAndUpdate(id, data);
    return this.findAll({});
  }
}
```

## Testing

If you have overrided some methods and want to test them, you can do it with a fake DB thanks to the injection of the connection.

```typescript
import { Connection } from './connection.service';
import { UserService } from './user.service';

const userService = new UserService(new Connection('myFakeDBURI'));

// Then test userService as a mere service.
```