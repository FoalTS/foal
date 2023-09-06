---
title: Database Set Up
id: tuto-2-database-set-up
slug: 2-database-set-up
---

The first step in this tutorial is to establish a database connection. If you haven't already done so, install [MySQL](https://dev.mysql.com/downloads/) or [PostgreSQL](https://www.postgresql.org/download/).

> *By default, Foal uses SQLite in every new application, as it does not require any installation. If you want to continue using it in this tutorial, you can skip this section and go to the next page.* 

First, install MySQL (or Postgres) driver.

```bash
npm install mysql # or pg
```

Open the `config/default.json` file and update the `database` section as follows. If your database is PostgreSQL, change the `type` value to `postgres`.

```json
{
  "port": "env(PORT)",
  "settings": {
    ...
  },
  "database": {
    "type": "mysql",
    "host": "env(DB_HOST)",
    "port": "env(DB_PORT)",
    "username": "env(DB_USERNAME)",
    "password": "env(DB_PASSWORD)",
    "database": "env(DB_NAME)"
  }
}

```

This file is the main configuration file for the application and is used as the basis for whatever environment the application is running in.

The syntax `env(*)` tells the configuration system to get the value from the given environment variable. If it does not exist, Foal will try to read it from a `.env` file.


Create a new `.env` file in the root of `backend-app` and provide the database credentials.

*.env*
```bash
# Use the identification information of your database.
# The values below are given as an example.
DB_HOST="localhost"
# Default port for PostgreSQL is 5432.
DB_PORT="3306"
DB_USERNAME="test"
DB_PASSWORD="test"
DB_NAME="test"
```

Restart the development server. The application is now connected to your database.

> You could have specified all the database connection options directly in the `default.json` file but this is considered bad practice.
>
> Configuration files are usually committed to version control and it is recommended not to commit files containing sensitive information.
