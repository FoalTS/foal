module.exports = {
  csrf: false,
  debug: true,
  session: { secret: 'my secret', resave: true, saveUninitialized: true },
  staticUrl: 'public/',
  templateEngine: '@foal/ejs',
  database: {
    "type": "sqlite",
    "database": "./test_db.sqlite",
    "synchronize": true
  }
};
