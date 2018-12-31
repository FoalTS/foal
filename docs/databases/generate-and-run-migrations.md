# Generate and Run Migrations

When developing an application, you need to synchronize model changes into the database. Changing the code of your entity files is not sufficient by itself. You need either to set `synchronize` to `true` in `ormconfig.json` or to use *migrations*.

The `synchronize` option is set to `true` by default in FoalTS. It auto creates the database schema on every application launch and thus allows fast development. But it is unsafe to use it on production once you get data in your database.

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