# 2. Set up a database connection

Let's get started by setting up a connection to the database. If you do not use SQLite, we assume that you have already *PostgreSQL* or *MSSQL* <!--or *MySQL* -->installed on your host with a database called `foal_examples_todo_list`.

> **How to create a database in postgres**
>
> 1. Open a terminal.
> 2. Connect to `psql` by running `psql -U postgres`.
> 3. Enter `CREATE DATABASE foal_examples_todo_list;`.
> 4. Quit `psql` by taping `\q`.

> **How to create a database in MSSQL**
>
> Follow [these instructions](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode) to create a database called `foal_examples_todo_list`.

<!--
> **How to create a database in mysql**
>
> 1. Open a terminal.
> 2. Connect to `mysql` by running `mysql -u root --password`.
> 3. Enter `CREATE DATABASE foal_examples_todo_list;`.
> 4. Quit `mysql` by taping `exit`.
-->

Using the foal cli we are going to create a sequelize connection. Go to the directory `src/app`, run `yo foal:service connection` and select the appropriate option.

You should now have a new file called `connection.service.ts` which looks like this:

```typescript
import { Service } from '@foal/core';
import { SequelizeConnectionService } from '@foal/sequelize';

import { config } from '../config';

@Service()
export class ConnectionService extends SequelizeConnectionService {
  constructor() {
    super(config.db.uri, config.db.options);
  }
}

```

This class is a *Service*. Basically a service can be any class that serves a restricted and well-defined purpose. It requires to be surrounded by the `Service` decorator from the `@foal/core` package.

This class inherits from the `SequelizeConnectionService` and is just a wrapper of Sequelize, a largly-used ORM, to set up a connection to a database. You must specify the URI of the database you want to connect to. You could pass it directly to the `super` function here but let's start using good practices and write it an config file.

You can find such file in the directory `config/`. Open `base.js` and change the string `'my_uri'` in the `developpement` configuration.

> You don't know what URI you should use? Here are some examples:
>
> PostgreSQL: `postgres://postgres:my_password@localhost:5432/foal_examples_todo_list`
>
> SQLite: `sqlite://foal_examples_todo_list.db`
>
> MSSQL: `mssql://sa:strongPassword1@localhost:1433/foal_examples_todo_list`

<!--
>
> MySQL: `mysql://root:my_password@localhost:3306/foal_examples_todo_list`
-->

You can test that your connection is working by running `npm run build` and then `npm run test`.