# Ship to Production

When deploying an application to production you need to:
- use https (or set `sessionCookieSecure` to `false` in `config/settings.production.json`),
- set the `NODE_ENV` environment variable to `production`,
- use database migrations instead of the TypeORM `synchronize` feature (it auto creates database schema on every application launch). You can disable this feature by setting the env variable `TYPEORM_SYNCHRONIZE` to false.

If you want to use a redis or another DB to store your sessions, you can specify the express session store of your choice in `src/app/index.ts`. By default sessions are stored in the default sqlite database.