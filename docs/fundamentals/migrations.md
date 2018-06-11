# Migrations

Migrations are stored in the `migrations` directory.

Run a migration
```
npm run migration:run
```

Revert a migration
```
npm run migration:revert
```

Generate a migration from the changes of the models
```
npm run migration:generate -- -n my-migration
```

Find more details in the [TypeORM docs](http://typeorm.io/#/migrations).