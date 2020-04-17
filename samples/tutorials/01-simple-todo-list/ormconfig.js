const { Config } = require('@foal/core');

module.exports = {
  type: "sqlite",
  database: Config.get2('database.database', 'string'),
  dropSchema: Config.get2('database.dropSchema', 'boolean', false),
  entities: ["build/app/**/*.entity.js"],
  migrations: ["build/migrations/*.js"],
  cli: {
    migrationsDir: "src/migrations"
  },
  synchronize: Config.get2('database.synchronize', 'boolean', false)
}
