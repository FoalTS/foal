// 3p
import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as csurf from 'csurf';
import * as express from 'express';
import * as session from 'express-session';
import * as logger from 'morgan';

// FoalTS
import {
  Class,
  Config,
  makeControllerRoutes,
  ServiceManager
} from '../core';
import { createMiddleware } from './create-middleware';
import { handleErrors } from './handle-errors';
import { notFound } from './not-found';

/**
 * Options of the `createApp` function.
 *
 * @export
 * @interface CreateAppOptions
 */
export interface CreateAppOptions {
  store?(session): any;
}

/**
 * Create an express application from the root controller of the Foal project.
 *
 * @export
 * @param {Class} rootControllerClass - The root controller, usually called `AppController` and located in `src/app`.
 * @param {CreateAppOptions} [options={}] - Optional options to specify the session store (default is MemoryStore).
 * @param {*} [expressInstance] - Optional express instance to be used as base.
 * @returns The express application.
 */
export function createApp(rootControllerClass: Class, options: CreateAppOptions = {}, expressInstance?) {
  const app = expressInstance || express();

  const loggerFormat = Config.get(
    'settings.loggerFormat',
    '[:date] ":method :url HTTP/:http-version" :status - :response-time ms'
  );

  app.use(logger(loggerFormat));
  app.use((_, res, next) => {
    res.removeHeader('X-Powered-By');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
    next();
  });
  app.use(
    Config.get('settings.staticPathPrefix', ''),
    express.static(Config.get('settings.staticPath', 'public'))
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(bodyParser.text({ type: [ 'text/*', 'application/graphql' ] }));
  app.use(cookieParser());
  app.use(session({
    cookie: {
      domain: Config.get('settings.session.cookie.domain'),
      httpOnly: Config.get('settings.session.cookie.httpOnly'),
      maxAge: Config.get('settings.session.cookie.maxAge'),
      path: Config.get('settings.session.cookie.path'),
      sameSite: Config.get('settings.session.cookie.sameSite'),
      secure: Config.get('settings.session.cookie.secure'),
    },
    name: Config.get('settings.session.name'),
    resave: Config.get('settings.session.resave', false),
    saveUninitialized: Config.get('settings.session.saveUninitialized', false),
    secret: Config.get('settings.session.secret', 'default_secret'),
    store: options.store ? options.store(session) : undefined,
  }));

  if (Config.get('settings.csrf', false) as boolean) {
    app.use(csurf({ cookie: Config.get('settings.csrfOptions.cookie', false) }));
  } else {
    app.use((req, res, next) => {
      req.csrfToken = () => 'CSRF protection disabled.';
      next();
    });
  }
  app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
      res.status(403).send('Bad csrf token.');
      return;
    }
    next(err);
  });

  const services = new ServiceManager();
  const routes = makeControllerRoutes('', [], rootControllerClass, services);
  for (const route of routes) {
    switch (route.httpMethod) {
      case 'DELETE':
        app.delete(route.path, createMiddleware(route, services));
        break;
      case 'GET':
        app.get(route.path, createMiddleware(route, services));
        break;
      case 'PATCH':
        app.patch(route.path, createMiddleware(route, services));
        break;
      case 'POST':
        app.post(route.path, createMiddleware(route, services));
        break;
      case 'PUT':
        app.put(route.path, createMiddleware(route, services));
        break;
      case 'HEAD':
        app.head(route.path, createMiddleware(route, services));
        break;
      case 'OPTIONS':
        app.options(route.path, createMiddleware(route, services));
        break;
    }
  }
  app.use(notFound());
  app.use(handleErrors(Config.get('settings.debug', false), console.error));

  return app;
}
