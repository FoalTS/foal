---
title: TypeORM
sidebar_label: Introduction
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


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

| Database | Versions | Driver |
| --- | --- | --- |
| PostgreSQL | 9.6+ ([Version Policy](https://www.postgresql.org/support/versioning/)) | `pg@8` |
| MySQL | 5.7+ ([Version Policy](https://en.wikipedia.org/wiki/MySQL#Release_history)) | `mysql@2` |
| SQLite | 3 | `sqlite3@5` |
| MongoDB | 4.0+ ([Version Policy](https://www.mongodb.com/support-policy)) | `mongodb@5` |

## Use with FoalTS

TypeORM is integrated by default in each new FoalTS project. This allows you to quickly create models, run migrations and use the authentication system without wasting time on configuration. However, if you do not wish to use it, you can refer to the page [Using another ORM](../other-orm/introduction.md).

### Initial Configuration

When creating a new project, an `SQLite` database is used by default as it does not require any additional installation (the data is saved in a file). The connection configuration is stored in `default.json` located in the `config/` directory.

### Packages

```
npm install typeorm@0.3.17 @foal/typeorm
```

Two packages are required to use TypeORM with FoalTS:
- The package [typeorm](https://www.npmjs.com/package/typeorm) which is the official one of the ORM. It includes everything you need to create models and make database requests.
- The package [@foal/typeorm](https://www.npmjs.com/package/@foal/typeorm) (maintained by FoalTS) which contains additional components. These are particularly useful when using FoalTS [authentication and authorization system](../../authentication/quick-start.md).

## Database Configuration Examples

### PostgreSQL

```sh
npm install pg
```

*config/default.\{json|yml|js\}*

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
# ...

database:
  type: postgres
  host: localhost
  port: 5432
  username: root
  password: password
  database: my-db
```

</TabItem>
<TabItem value="json">

```json
{
  // ...

  "database": {
    "type": "postgres",
    "host": "localhost",
    "port": 5432,
    "username": "root",
    "password": "password",
    "database": "my-db"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  // ...

  database: {
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "root",
    password: "password",
    database: "my-db"
  }
}
```

</TabItem>
</Tabs>

### MySQL

```sh
npm install mysql
```

*config/default.\{json|yml|js\}*

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
# ...

database:
  type: mysql
  host: localhost
  port: 3306
  username: root
  password: password
  database: my-db
```

</TabItem>
<TabItem value="json">

```json
{
  // ...

  "database": {
    "type": "mysql",
    "host": "localhost",
    "port": 3306,
    "username": "root",
    "password": "password",
    "database": "my-db"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  // ...

  database: {
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "password",
    database: "my-db"
  }
}
```

</TabItem>
</Tabs>

## Configuration and Testing

When running the command `npm run test` with the above configuration, FoalTS will try to retrieve the database configuration in this order:

1. `config/test.yml` and `config/test.json`.
2. `config/default.yml` and `config/default.json`.

In this way, you can define a default configuration in the `config/default.{yml|json}` file to use both during development and testing and override some settings in `config/test.{yml|json}` during testing.

> You learn more on how configuration works in Foal [here](../../architecture/configuration.md)

In the example below, we add two new options:
- `dropSchema` clears the database each time we create the connection
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
import { DataSource } from 'typeorm';
import { createDataSource } from '../db';

describe('xxx', () => {

  let dataSource: DataSource;

  beforeEach(async () => {
    dataSource = createDataSource();
    await dataSource.initialize();
  });

  afterEach(async () => {
    if (dataSource) {
      await dataSource.destroy()
    }
  });

  it('yyy', () => {
    // ...
  });

});
```
