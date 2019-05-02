# TypeORM \(SQL & noSQL\)

_A simple model:_

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

FoalTS uses [TypeORM](https://github.com/FoalTS/foal/tree/30dbbfcb4e7391c760604b71428422e9c8846c7c/docs/databases/typeorm.io) as default _Object-Relational Mapping_ to access your database\(s\). It is probably the most mature ORM in the Node.js ecosystem and supports both [Active Record](https://en.wikipedia.org/wiki/Active_record_pattern) and [Data Mapper](https://en.wikipedia.org/wiki/Data_mapper_pattern) patterns.

> _TypeORM helps you to develop any kind of application that uses databases - from small applications with a few tables to large scale enterprise applications with multiple databases._
>
> Source: [http://typeorm.io](http://typeorm.io)

Here is a non-exhaustive list of its features:

* migrations and automatic migrations generation
* uni-directional, bi-directional and self-referenced relations
* eager and lazy relations
* TypeScript support
* connection configuration in json / xml / yml / env formats
* transactions
* etc

TypeORM supports many SQL databases \(MySQL / MariaDB / Postgres / SQLite / Microsoft SQL Server / Oracle / sql.js\) as well as the MongoDB NoSQL database.

> Although this documentation presents the basic features of TypeORM, you may be interested in reading the [official documentation](http://typeorm.io) to learn more advanced features.

## Integration in FoalTS

TypeORM is integrated by default in every new FoalTS project. This lets you quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the section _Using another ORM_.

### Initial configuration

When creating a new project, an `SQLite` database is used by default as it does not require any additional installation. The connection configuration is stored in `ormconfig.json` located at the root of your project.

```javascript
{
  "type": "sqlite",
  "database": "./db.sqlite3",
  "entities": ["lib/app/**/*.entity.js"],
  "migrations": ["lib/migrations/*.js"],
  "cli": {
    "migrationsDir": "src/migrations"
  },
  "synchronize": true
}
```

Database configuration and credentials can be stored in this file or in environment variables \(ideal for deployment\).

The `synchronize` option auto creates the database schema on every application launch. This allows fast development: you can edit and save your models and the database changes. In production, you should use [migrations](generate-and-run-migrations.md) to make sure you do not loose prod data.

### The `typeorm` and `@foal/typeorm` packages

The `typeorm` package is the official package of the library. It includes everything you need to create models and make requests.

The `@foal/typeorm` package contains components based on TypeORM to be used with the [authentication system](../authentication-and-access-control/introduction.md) \(the `UserWithPermissions` model is an example\).

### The database drivers

You need to install a _database driver_ for each database you are connecting to. The SQLite driver is installed by default in every new project.

* for **MySQL** or **MariaDB**

  `npm install mysql --save` \(you can install mysql2 instead as well\)

* for **PostgreSQL**

  `npm install pg --save`

* for **SQLite**

  `npm install sqlite3 --save`

* for **Microsoft SQL Server**

  `npm install mssql --save`

* for **sql.js**

  `npm install sql.js --save`

* for **MongoDB**

  `npm install mongodb --save`

## Quick tips to create a database \(in development\)

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

### Microsoft SQL Server \(MSSQL\)

Follow [these instructions](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode).

