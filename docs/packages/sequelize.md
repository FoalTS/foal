# @foal/sequelize

`@foal/sequelize` provides a connection and a model service to connect to a PostreSQL<!-- or MySQL--> or SQLite database. It is based on the [Sequelize](http://docs.sequelizejs.com/) ORM.

## Prerequisities

To use these services you need to install the package (`@foal/sequelize`) along with its SQLite (`sqlite3`) or <!--MySQL (`mysql2`) or -->PostgreSQL (`pg@6 pg-hstore`) clients. If you have already specified which database you are using while creating the project they should already been installed.

> To install a `npm` package you need to run this command: `npm install --save <package_name>`.

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
    super(
      'users', // Name of the table
      {
        username: Sequelize.STRING // Sequelize schema
      },
      connection // Connection service
    );
  }
}
```

> *Note*: The `SequelizeModelService<IModel, ICreatingModel = IModel, IIdAndTimeStamps extends { id: any } = DefaultIdAndTimeStamps, IdType = number>` class implements the `IModelService` interface.

> *Note*: If you are using a SQLite database, the methods `findByIdAndUpdate`, `findByOneAndUpdate`, `findByIdAndReplace` and `findByOneAndReplace` are not atomic (they need to make several requests to the database).

## Testing

If you have overrided some methods and want to test them, you can do it with a fake DB thanks to the injection of the connection.

```typescript
import { Connection } from './connection.service';
import { UserService } from './user.service';

const userService = new UserService(new Connection('myFakeDBURI'));

// Then test userService as a mere service.
```