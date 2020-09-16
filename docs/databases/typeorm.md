# TypeORM

> You are reading the documentation for version 2 of FoalTS. The documentation for version 1 can be found [here](#). To migrate to version 2, follow [this guide](../upgrade-to-v2/index.md).

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

> Although this documentation presents the basic features of TypeORM, you may be interested in reading the [official documentation](https://typeorm.io/) to learn more advanced features.

## Supported Databases

FoalTS supports officially the following databases:

| Database | Versions |
| --- | --- |
| PostgreSQL | 9.6+ ([Version Policy](https://www.postgresql.org/support/versioning/)) |
| MySQL | 5.7+ ([Version Policy](https://en.wikipedia.org/wiki/MySQL#Release_history)) |
| MariaDB | 10.2+ ([Version Policy](https://en.wikipedia.org/wiki/MariaDB#Versioning)) |
| SQLite | 3 |
| MongoDB | 4.0+ ([Version Policy](https://www.mongodb.com/support-policy)) |

## Use with FoalTS

TypeORM is integrated by default in each new FoalTS project. This allows you to quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the page [Using another ORM](./using-another-orm.md).

### Initial Configuration

When creating a new project, an `SQLite` database is used by default as it does not require any additional installation (the data is saved in a file). The connection configuration is stored in `ormconfig.js` and `default.json` located respectively at the root of your project and in the `config/` directory.

*ormconfig.js*
```js
const { Config } = require('@foal/core');

module.exports = {
  type: 'sqlite',
  database: Config.get('database.database', 'string'),
  dropSchema: Config.get('database.dropSchema', 'boolean', false),
  entities: ['build/app/**/*.entity.js'],
  migrations: ['build/migrations/*.js'],
  cli: {
    migrationsDir: 'src/migrations'
  },
  synchronize: Config.get('database.synchronize', 'boolean', false)
}
```

{% code-tabs %}
{% code-tabs-item title="YAML" %}
```yaml
database:
  database: ./db.sqlite3
```
{% endcode-tabs-item %}
{% code-tabs-item title="JSON" %}
```json
{
  "database": {
    "database": "./db.sqlite3"
  }
}
```
{% endcode-tabs-item %}
{% code-tabs-item title="JS" %}
```javascript
module.exports =   {
  database: {
    database: "./db.sqlite3",
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}


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

  host: Config.get('database.host', 'string'),
  port: Config.get('database.port', 'number'),
  username: Config.get('database.username', 'string'),
  password: Config.get('database.password', 'string'),
  database: Config.get('database.database', 'string'),

  dropSchema: Config.get('database.dropSchema', 'boolean', false),
  synchronize: Config.get('database.synchronize', 'boolean', false),
  
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
}
```

With this configuration, database credentials can be provided in a YAML, a JSON or a `.env `configuration file or in environment variables.

{% code-tabs %}
{% code-tabs-item title="config/default.yml" %}
```yaml
# ...

database:
  host: localhost
  port: 3306
  username: root
  password: password
  database: my-db
```
{% endcode-tabs-item %}
{% code-tabs-item title="config/default.json" %}
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
{% endcode-tabs-item %}
{% code-tabs-item title="JS" %}
```javascript
module.exports = {
  // ...
  database: {
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "my-db"
  }
}
```
{% endcode-tabs-item %}
{% endcode-tabs %}

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

  afterEach(async () => {
    if (connection) {
      await connection.close()
    }
  });

  it('yyy', () => {
    // ...
  });

});
```
