import { Foal } from '@foal/core';
import { getCallback, handleErrors } from '@foal/express';
import * as bodyParser from 'body-parser';
import * as express from 'express';
import * as session from 'express-session';

import { AppModule } from './app/app.module';
import { authenticate } from './authentication';
import { config } from './config';

const app = express();
const foalApp = new Foal(AppModule);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({ secret: 'my secret', resave: true, saveUninitialized: true }));
app.use(authenticate(foalApp));

app.use(getCallback(foalApp));

app.use(handleErrors(config.errors));

app.listen(3000, () => console.log(`Listening on port 3000`));
