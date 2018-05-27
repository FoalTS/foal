module.exports = {
  csrfProtection: false,
  debugMode: true,
  session: { secret: 'my secret', resave: true, saveUninitialized: true },
  staticUrl: 'public/',
  templateEngine: '@foal/ejs'
};
