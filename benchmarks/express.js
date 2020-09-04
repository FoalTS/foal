const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const jwt = require('express-jwt');

const app = express();

// Middlewares
app.use(morgan('[:date] ":method :url HTTP/:http-version" :status - :response-time ms'));
app.use(helmet())
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const apiRouter = express.Router();
apiRouter.get(
  '/users',
  jwt({ secret: process.env.SETTINGS_JWT_SECRET }),
  (_, res) => res.send([ { name: 'someone' } ])
);

app.use('/api', apiRouter);

app.listen(3000);
