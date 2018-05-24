const { User } = require('./src/user.entity.spec');

module.exports = [
  {
    name: "mysql-connection",
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "test",
    password: "test",
    database: "test",
    entities: [ User ],
    synchronize: true,
  },
  {
    name: "mariadb-connection",
    type: "mariadb",
    host: "localhost",
    port: 3307,
    username: "test",
    password: "test",
    database: "test",
    entities: [ User ],
    synchronize: true,
  },
  {
    name: "postgres-connection",
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "test",
    password: "test",
    database: "test",
    entities: [ User ],
    synchronize: true,
  },
  {
    name: "sqlite-connection",
    type: "sqlite",
    database: "./test_db.sqlite",
    entities: [ User ],
    synchronize: true,
  }
  // mssql://SA:strongPassword1@localhost:1433
];
