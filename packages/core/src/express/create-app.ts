import * as path from 'path';

import * as bodyParser from 'body-parser';
import * as csurf from 'csurf';
import * as express from 'express';
import * as session from 'express-session';
import * as helmet from 'helmet';
import * as logger from 'morgan';

import { initDB } from '../common';
import { App, Config, Module } from '../core';
import { getMiddlewares } from './get-middlewares';

export function createApp(rootModule: Module) {
  const app = new App(rootModule);
  const preHook = initDB(app.models);
  app.controllers.forEach(controller => {
    controller.addPreHooksAtTheTop([ preHook ]);
  });

  const expressApp = express();

  expressApp.use(logger('[:date] ":method :url HTTP/:http-version" :status - :response-time ms'));
  expressApp.use(express.static(path.join(process.cwd(), Config.get('settings', 'staticUrl', '/public') as string)));
  expressApp.use(helmet());
  expressApp.use(bodyParser.json());
  expressApp.use(bodyParser.urlencoded({ extended: false }));
  expressApp.use(session({
    resave: Config.get('settings', 'sessionResave', false),
    saveUninitialized: Config.get('settings', 'sessionSaveUninitialized', true),
    secret: Config.get('settings', 'sessionSecret', ''),
  }));

  if (Config.get('settings', 'csrf', false) as boolean) {
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

  expressApp.use(getMiddlewares(app, { debug: Config.get('settings', 'debug', false) as boolean }, [
    {
      req: 'csrfToken',
      state: 'csrfToken'
    }
  ]));

  return expressApp;
}
