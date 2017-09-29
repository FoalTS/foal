# @foal/sequelize

## Prerequisities 

```ts
npm install --save express @foal/core @foal/sequelize

# And one of the following:
$ npm install --save pg pg-hstore
$ npm install --save mysql2
$ npm install --save sqlite3
$ npm install --save tedious // MSSQL
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "emitDecoratorMetadata": true,
    "experimentalDecorators": true,
    "lib": [
      "es6",
      "dom"
    ]
    ...
}
```

## Setting up a connection

```ts
import { Injectable } from '@foal/core';
import { SequelizeConnectionService } from '@foal/sequelize';

@Injectable()
export class Connection extends SequelizeConnectionService {
  constructor() {
    super('postgres://user:pass@example.com:5432/dbname');
  }
}
```

## Get connected to a table

```ts
import { Injectable } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { Connection } from './connection.service';

@Injectable()
export class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }
}
```

## Serve your service as an API (optional)

```ts
import * as bodyParser from 'body-parser';
import * as express from 'express';
import { FoalModule, newExpressDecorator, rest } from '@foal/core';

import { Connection } from './connection.service';
import { User } from './user.service';

const app = express();
const foal = new FoalModule({
  services: [ Connection, User ],
  controllerBindings: [ rest.bindController('/users', User) ],
  sharedControllerDecorators: [
    newExpressDecorator(bodyParser.urlencoded({ extended: false })),
    newExpressDecorator(bodyParser.json())
  ]
});
app.use(foal.expressRouter());
app.listen(3000, () => console.log('Listening...'));
```

## Restriction

Let's say that we want to forbid to use the method `delete` when using the service as a controller.

```ts
import { Injectable, MethodNotAllowed, RestParams } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { Connection } from './connection.service';

@Injectable()
export class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }

  @MethodNotAllowed()
  public delete(id: any, params: RestParams): Promise<any> {
    return super.delete(id, params);
  }
}
```

## Extending methods

Let's say that we want to return all the users when updating one.

```ts
import { Injectable, MethodNotAllowed, RestParams } from '@foal/core';
import { Sequelize, SequelizeService } from '@foal/sequelize';

import { Connection } from './connection.service';

@Injectable()
export class User extends SequelizeService {
  constructor(protected connection: Connection) {
    super('users', {
      username: Sequelize.STRING
    }, connection);
  }

  public async update(id: any, data: any, params: RestParams): Promise<any> {
    await super.update(id, data, params);
    return this.getAll({ query: {} })
  }
}
```

## Testing

If you have overrided some methods and want to test them, you can do it with a fake DB thanks to the injection of the connection.

```ts
import { Connection } from './connection.service';
import { User } from './user.service';

const userService = new User(new Connection('myFakeDBURI'));

// Then test userService as a mere service.
```