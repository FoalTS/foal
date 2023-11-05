---
title: TypeORM
sidebar_label: SQL Databases (TypeORM)
---

> *FoalTS components using TypeORM officially support the following databases: PostgreSQL, MySQL, MariaDB and SQLite*.

*A simple model:*
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    firstName: string;

    @Column()
    lastName: string;

}
```

## The ORM

FoalTS uses [TypeORM](https://typeorm.io/) as default *Object-Relational Mapping*. This allows you to create classes to interact with your database tables (or collections). TypeORM is written in TypeScript and supports both [Active Record](https://en.wikipedia.org/wiki/Active_record_pattern) and [Data Mapper](https://en.wikipedia.org/wiki/Data_mapper_pattern) patterns.

Here is a non-exhaustive list of its features:
- migrations and automatic migrations generation
- uni-directional, bi-directional and self-referenced relations
- eager and lazy relations
- TypeScript support
- connection configuration in json / xml / yml / env formats
- transactions
- etc

TypeORM supports many SQL databases (MySQL / MariaDB / Postgres / SQLite / Microsoft SQL Server / Oracle / sql.js) as well as the MongoDB NoSQL database.

> Although this documentation presents the basic features of TypeORM, you may be interested in reading the [official documentation](https://typeorm.io/) to learn more advanced features.


## Use with FoalTS

TypeORM is integrated by default in each new FoalTS project. This allows you to quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the page [Using another ORM](./using-another-orm.md).

### Initial Configuration

When creating a new project, an `SQLite` database is used by default as it does not require any additional installation (the data is saved in a file). The connection configuration is stored in `ormconfig.js` and `default.json` located respectively at the root of your project and in the `config/` directory.

*ormconfig.js*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: 'sqlite',
  database: Config.get('database.database'),
  dropSchema: Config.get('database.dropSchema', false),
  entities: ['build/app/**/*.entity.js'],
  migrations: ['build/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations'
  },
  synchronize: Config.get('database.synchronize', false)
}
```

*default.json (example)*
```json
{
  "port": 3001,
  "settings": {
    ...
  },
  "database": {
    "database": "./db.sqlite3"
  }
}
```

### Packages

```
npm install typeorm @foal/typeorm
```

Two packages are required to use TypeORM with FoalTS:
- The package [typeorm](https://www.npmjs.com/package/typeorm) which is the official one of the ORM. It includes everything you need to create models and make database requests.
- The package [@foal/typeorm](https://www.npmjs.com/package/@foal/typeorm) (maintained by FoalTS) which contains additional components. These are particularly useful when using FoalTS [authentication and authorization system](../authentication-and-access-control/quick-start.md).

## Database Configuration Examples

This section shows how to configure **MySQL** or **PostgreSQL** with Foal.

*ormconfig.js*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: 'mysql', // or 'postgres'

  host: Config.get('database.host'),
  port: Config.get('database.port'),
  username: Config.get('database.username'),
  password: Config.get('database.password'),
  database: Config.get('database.database'),

  dropSchema: Config.get('database.dropSchema', false),
  synchronize: Config.get('database.synchronize', false),
  
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
}
```

With this configuration, database credentials can be provided in a YAML, a JSON or a `.env `configuration file or in environment variables.

```yaml
# ...

database:
  host: localhost
  port: 3306
  username: root
  password: password
  database: my-db
```

```json
{
  // ...
  "database": {
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "my-db"
  }
}
```

```json
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USERNAME=root
DATABASE_PASSWORD=password
DATABASE_DATABASE=my-db
```


### MySQL / MariaDB

Install `mysql` or `mysql3` drivers.

```sh
npm install mysql --save # mysql2 is also supported
```

### PostgreSQL

Install `pg` driver.

```sh
npm install pg --save
```

## Configuration and Testing

When running the command `npm run test` with the above configuration, FoalTS will try to retrieve the database configuration in this order:

1. Environment variables.
2. `.env` file.
3. `config/test.yml` and `config/test.json`.
4. `config/default.yml` and `config/default.json`.

For example, if the environment variable `DATABASE_PASSWORD` is defined, Foal will use its value. Otherwise, it will look at the `.env` file to see if it is defined here. If it is not, it will go through the YAML and JSON `config/` files.

In this way, you can define a default configuration in the `config/default.{yml|json}` file to use both during development and testing and override some settings in `config/test.{yml|json}` during testing.

> You learn more on how configuration works in Foal [here](../deployment-and-environments/configuration.md)

In the example below, we add two new options:
- `dropSchema` clears the database each time we call `createConnection`
- and `synchronize` synchronizes the database tables with your entities so your do not have to generate and run migrations during testing.

*config/test.yml*
```yaml
# ...

database:
  username: 'test'
  password: 'test'
  database: 'test'
  dropSchema: true
  sychronize: true
```

*Example of a test*
```typescript
import { createConnection, Connection } from 'typeorm';

describe('xxx', () => {

  let connection: Connection;

  beforeEach(() => connection = await createConnection())

  afterEach(() => {
    if (connection) {
      connection.close()
    }
  });

  it('yyy', () => {
    // ...
  });

});
```
