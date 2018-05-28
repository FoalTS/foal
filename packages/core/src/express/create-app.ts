import * as path from 'path';

import * as bodyParser from 'body-parser';
import * as csurf from 'csurf';
import * as express from 'express';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as logger from 'morgan';
import { App } from '..';

import { Config, Module } from '../core';
import { getMiddlewares } from './get-middlewares';

export interface IConfig {
  staticUrl: string;
  session: any;
  csrfProtection: boolean;
  debug: boolean;
}

export function createApp(rootModule: Module) {
  const config = new Config<IConfig>('base').config;
  const expressApp = express();

  expressApp.use(logger('[:date] ":method :url HTTP/:http-version" :status - :response-time ms'));
  expressApp.use(express.static(path.join(process.cwd(), config.staticUrl)));
  expressApp.use(helmet());
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(session(config.session));

  if (config.csrfProtection) {
    expressApp.use(csurf());
    expressApp.use((req, res, next) => {
      req.csrfToken = req.csrfToken();
      next();
    });
  }
  expressApp.use((req, res, next) => {
    if (req.body) {
      delete req.body._csrf;
    }
    next();
  });
  expressApp.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).send('Bad csrf token.');
    } else {
      next(err);
    }
  });

  expressApp.use(getMiddlewares(new App(rootModule), { debug: config.debug }, [
    {
      req: 'csrfToken',
      state: 'csrfToken'
    }
  ]));

  return expressApp;
}
