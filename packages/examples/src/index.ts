import { Foal } from '@foal/core';
import { getCallback } from '@foal/express';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { AppModule } from './app/app.module';

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(getCallback(new Foal(AppModule)));

app.listen(3000, () => console.log(`Listening on port 3000`));
