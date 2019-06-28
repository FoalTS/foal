# Generate and Run Migrations

> This document describes changes introduced in version 1.0.0. Instructions to upgrade to the new release can be found [here](https://github.com/FoalTS/foal/releases/tag/v1.0.0). Old documentation can be found [here]().

When developing an application, you need to synchronize model changes into the database. Changing the code of your entity files is not sufficient by itself. You need either to set `synchronize` to `true` in `ormconfig.json` or to use *migrations*.

When set to `true`, the `synchronize` option auto creates the database schema on every application launch. This allows fast development but it is not really suitable for production (you could loose data by mistake). This is why this option is set to `false` by default.

> Previous versions of FoalTS (<v1.0.0) used to set `synchronize: true` by default.

Migrations are TS/JS files that execute SQL queries to update the database schema. TypeORM provides great tools to auto generate these migrations based on model changes.

Migrations are stored in the `src/migrations` directory.

## Auto generate migrations from your model changes

```sh
npm run build:app # Build the entities
npm run migration:generate -- -n my-migration # Generate the migration
npm run build:migrations # Build the migrations
npm run migration:run # Run the migrations
```

## Run the migrations

```sh
npm run migration:run
```

## Revert the last migration

```sh
npm run migration:revert
```

## Advanced usage

Find more details in the [TypeORM docs](http://typeorm.io/#/migrations).