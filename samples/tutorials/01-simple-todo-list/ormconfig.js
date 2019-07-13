const { Config } = require('@foal/core');

module.exports = {
  type: "sqlite",
  database: Config.get('database.database'),
  dropSchema: Config.get('database.dropSchema', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get('database.synchronize', false)
}
