import 'source-map-support/register';

import { App } from '@foal/core';
import { getMiddlewares } from '@foal/express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';

import { AppModule } from './app/app.module';
import { config } from './config';

const app = express();
const foalApp = new App(AppModule);

app.use(express.static('public/'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'my secret', resave: true, saveUninitialized: true }));

// TODO: Add CSRF protection
app.use(getMiddlewares(foalApp, { debugMode: config.debugMode }));

app.listen(3000, () => console.log(`Listening on port 3000`));
