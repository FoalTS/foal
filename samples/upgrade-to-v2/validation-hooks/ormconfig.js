const { Config } = require('@foal/core');

module.exports = {
  type: "sqlite",
  database: Config.get('database.database', 'string'),
  dropSchema: Config.get('database.dropSchema', 'boolean', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get('database.synchronize', 'boolean', false)
}
