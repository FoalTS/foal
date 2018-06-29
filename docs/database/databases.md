# Databases

// Add a little get-started (some code or a cli command)

FoalTS supports several databases thanks to TypeORM features. When creating a project `SQLite` is used by default as it is does not require any further installation. However though this database fits the need for prototyping, you may need to use other ones for larger projects.

To use a database you need to install a driver that depends on the database you are connecting to.

Database configuration and credentials are stored in a config file `ormconfig` or in environment variables. Find more details [here](http://typeorm.io/#/using-ormconfig).

*Note: Having several databases is currently not supported.*

## SQLite

```sh
npm install sqlite3 --save
```

## MySQL or MariaDB

```sh
npm install mysql --save
```

> **How to create a database in MySQL**
>
> 1. Open a terminal.
> 2. Connect to `mysql` by running `mysql -u root --password`.
> 3. Enter `CREATE DATABASE foal_examples_todo_list;`.
> 4. Quit `mysql` by taping `exit`.

## PostgreSQL

```sh
npm install pg --save
```

> **How to create a database in PostgreSQL**
>
> 1. Open a terminal.
> 2. Connect to `psql` by running `psql -U postgres`.
> 3. Enter `CREATE DATABASE foal_examples_todo_list;`.
> 4. Quit `psql` by taping `\q`.

## MSSQL

```sh
npm install mssql --save
```

> **How to create a database in MSSQL**
>
> Follow [these instructions](https://docs.microsoft.com/en-us/sql/linux/sql-server-linux-develop-use-vscode) to create a database called `foal_examples_todo_list`.


