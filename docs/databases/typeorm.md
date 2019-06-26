# TypeORM

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

## TypeORM

FoalTS uses [TypeORM](typeorm.io/) as default *Object-Relational Mapping* to access your database(s). It is probably the most mature ORM in the Node.js ecosystem and supports both [Active Record](https://en.wikipedia.org/wiki/Active_record_pattern) and [Data Mapper](https://en.wikipedia.org/wiki/Data_mapper_pattern) patterns.

> *TypeORM helps you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases.*
>
> Source: http://typeorm.io

Here is a non-exhaustive list of its features:
- migrations and automatic migrations generation
- uni-directional, bi-directional and self-referenced relations
- eager and lazy relations
- TypeScript support
- connection configuration in json / xml / yml / env formats
- transactions
- etc

TypeORM supports many SQL databases (MySQL / MariaDB / Postgres / SQLite / Microsoft SQL Server / Oracle / sql.js) as well as the MongoDB NoSQL database.

> Although this documentation presents the basic features of TypeORM, you may be interested in reading the [official documentation](http://typeorm.io) to learn more advanced features.


## Integration in FoalTS

TypeORM is integrated by default in every new FoalTS project. This lets you quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the section *Using another ORM*.

### Initial configuration

> This section describes changes introduced in version 1.0.0. Instructions to upgrade to the new release can be found [here](https://github.com/FoalTS/foal/releases/tag/v1.0.0). Old documentation can be found [here]().

When creating a new project, an `SQLite` database is used by default as it does not require any additional installation. The connection configuration is stored in `ormconfig.js` and `default.json` located respectively at the root of your project and in the `config/` directory.

*ormconfig.js*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: "sqlite",
  database: Config.get('database.database'),
  dropSchema: Config.get('database.dropSchema', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
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

### The `typeorm` and `@foal/typeorm` packages

The `typeorm` package is the official package of the library. It includes everything you need to create models and make requests.

The `@foal/typeorm` package contains components based on TypeORM to be used with the [authentication system](../authentication-and-access-control/introduction.md) (the `UserWithPermissions` model is an example).

### The database drivers

You need to install a *database driver* for each database you are connecting to. The SQLite driver is installed by default in every new project.

- for **MySQL** or **MariaDB**

  ```npm install mysql --save``` (you can install mysql2 instead as well)

- for **PostgreSQL**

  ```npm install pg --save```

- for **SQLite**

  ```npm install sqlite3 --save```

- for **Microsoft SQL Server**

  ```npm install mssql --save```

- for **sql.js**

  ```npm install sql.js --save```

- for **MongoDB**

  ```npm install mongodb --save```

## Quick tips to create a database (in development)

### MySQL

1. Open a terminal.
2. Connect to `mysql` by running `mysql -u root --password`.
3. Enter `CREATE DATABASE foal_examples_todo_list;`.
4. Quit `mysql` by taping `exit`.

### PostgreSQL

1. Open a terminal.
2. Connect to `psql` by running `psql -U postgres`.
3. Enter `CREATE DATABASE foal_examples_todo_list;`.
4. Quit `psql` by taping `\q`.

### Microsoft SQL Server (MSSQL)

Follow [these instructions](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode).


