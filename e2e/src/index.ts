import { Foal } from '@foal/core';
import * as bodyParser from 'body-parser';
import * as express from 'express';

import { AppModule } from './app/app.module';

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(new Foal(AppModule).expressRouter());

app.listen(3000, () => console.log(`Listening on port 3000`));
