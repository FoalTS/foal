# AWS Beanstalk

> This tutorial shows how to deploy an application that uses an SQL database to [AWS Beanstalk](https://console.aws.amazon.com/elasticbeanstalk/home). It assumes that you already have an AWS account and have access to your console.

## Prerequisites

### Do not use SQLite

```
npm uninstall sqlite3 connect-sqlite3
```

You cannot use SQLite (or sql.js) when deploying an application to AWS Beanstalk. Uninstall sqlite3 and connect + change index.ts. If you’re using sessions (for example LoginControler), you need to install a store.

### Configure the Database Credentials

`synchronize` should be false (regarder ce qu'il se passe si j'avais synchronize `true` avant, comment ça se passe avec les migrations ?).

```js
const { Config } = require('@foal/core');

module.exports = {
  type: "sqlite",
  url: Config.get('database.url'),
  database: process.env.RDS_DB_NAME || Config.get('database.name'),
  port: process.env.RDS_PORT || Config.get('database.port'),
  host: process.env.RDS_HOSTNAME || Config.get('database.host'),
  username: process.env.RDS_USERNAME || Config.get('database.username'),
  password: process.env.RDS_PASSWORD || Config.get('database.password'),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    "migrationsDir": "src/migrations"
  },
  synchronize: false
}

```

Mettre les credentials local dans `default.json` (je veux peut-être lancer l'appl localement en mode prod). Mettre les credentials dans `test.json` (que des valeurs "test")

> This configuration will be the standard, etc.

### Sessions

If no sessions, skips this part.

Otherwise: redis, postgres

## Create the AWS Application and Add a Database

Create the app / env with the example

Check that it is properly deployed

Add the environment variable `NODE_ENV`

Create the database

## Deploy the Foal Application

AWS
---

Build the app

ScreenShot of the compression

Heroku
---

heroku-postbuild: npm run build:app && npm run build:

Comment on fait si frontend angular ? D'abord build angular puis build back

## Run the Database Migrations

Windows / Linux / Mac

Where to find the credentials

```sh
DATABASE_HOST=xx DATA, npm run migrations # what the name of the command?
```

If you [set up]() your application with the EB CLI:
```
eb ssh FoalApp-Env
```

```
heroku run npm run migrations
```

## Run Shell Scripts

Heroku: Loads a separate *dyno* (Heroku Linux machine)