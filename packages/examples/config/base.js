const path = require('path');

module.exports = {
  csrf: false,
  debug: true,
  session: { secret: 'my secret', resave: true, saveUninitialized: true },
  staticUrl: 'public/',
  // templateEngine: '@foal/ejs',
  databases: [
    {
      "name": "default",
      "type": "sqlite",
      "database": "./test_db.sqlite",
      "entities": [
        "./lib/**/*.model.js"
      ],
      "synchronize": true
    }
  ]
};
