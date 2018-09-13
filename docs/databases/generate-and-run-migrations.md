# Generate and Run Migrations

Migrations are stored in the `src/migrations` directory.

Run a migration
```sh
npm run migration:run
```

Revert a migration
```sh
npm run migration:revert
```

Generate a migration from the changes in your entities
```sh
npm run build:app # Build the entities
npm run migration:generate -- -n my-migration # Generate the migration
npm run build:migrations # Build the migrations
npm run migration:run # Run the migrations
```

Find more details in the [TypeORM docs](http://typeorm.io/#/migrations).