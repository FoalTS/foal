// 3p
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
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

interface ExpressApplication extends express.Express {
  [name: string]: any;
}

interface CreateAppOptions {
  expressInstance?: ExpressApplication;
  methods?: {
    handleError?: boolean;
  };
  preMiddlewares?: (express.RequestHandler | express.ErrorRequestHandler)[];
  postMiddlewares?: (express.RequestHandler | express.ErrorRequestHandler)[];
}

/**
 * Create an Express application from the root controller.
 *
 * @export
 * @param {Class} rootControllerClass - The root controller, usually called `AppController` and located in `src/app`.
 * @param {(ExpressApplication|ExpressOptions)} [expressInstanceOrOptions] - Express instance or options containaining
 * Express middlewares or other settings.
 * @param {ExpressApplication} [expressInstanceOrOptions.expressInstance] - Express instance to be used as base for the
 * returned application.
 * @param {(express.RequestHandler | express.ErrorRequestHandler)[]} [expressInstanceOrOptions.preMiddlewares] Express
 * middlewares to be executed before the controllers and hooks.
 * @param {(express.RequestHandler | express.ErrorRequestHandler)[]} [expressInstanceOrOptions.postMiddlewares] Express
 * middlewares to be executed after the controllers and hooks, but before the 500 or 404 handler get called.
 * @returns {ExpressApplication} The express application.
 */
export function createApp(
  rootControllerClass: Class, expressInstanceOrOptions?: ExpressApplication|CreateAppOptions
): ExpressApplication {
  let app: ExpressApplication = express();

  if (expressInstanceOrOptions && typeof expressInstanceOrOptions === 'function') {
    app = expressInstanceOrOptions;
  }

  if (expressInstanceOrOptions && typeof expressInstanceOrOptions === 'object') {
    if (expressInstanceOrOptions.expressInstance) {
      app = expressInstanceOrOptions.expressInstance;
    }
    for (const middleware of expressInstanceOrOptions.preMiddlewares || []) {
      app.use(middleware);
    }
  }

  const LOG_FORMAT_NONE = 'none';

  const loggerFormat: string =  Config.get(
    'settings.loggerFormat',
    '[:date] ":method :url HTTP/:http-version" :status - :response-time ms'
  );

  if (loggerFormat !== LOG_FORMAT_NONE) {
    app.use(logger(loggerFormat));
  }

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
  app.use((err, req, res, next) => {
    if (err.type !== 'entity.parse.failed') {
      next(err);
      return;
    }
    res.status(err.status).send({
      body: err.body,
      message: err.message
    });
  });
  app.use(express.urlencoded({ extended: false }));
  app.use(express.text({ type: ['text/*', 'application/graphql'] }));
  app.use(cookieParser());

  const services = new ServiceManager();
  app.foal = { services };
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

  if (expressInstanceOrOptions && typeof expressInstanceOrOptions === 'object') {
    for (const middleware of expressInstanceOrOptions.postMiddlewares || []) {
      app.use(middleware);
    }
  }

  app.use(notFound());
  app.use(handleErrors(Config.get('settings.debug', false), console.error));

  return app;
}

/**
 * Create an Express application from the root controller and call its "init" method if it exists.
 *
 * @export
 * @param {Class} rootControllerClass - The root controller, usually called `AppController` and located in `src/app`.
 * @param {(ExpressApplication|CreateAppOptions)} [expressInstanceOrOptions] - Express instance or options containaining
 * Express middlewares.
 * @param {(express.RequestHandler | express.ErrorRequestHandler)[]} [expressInstanceOrOptions.preMiddlewares] Express
 * middlewares to be executed before the controllers and hooks.
 * @param {(express.RequestHandler | express.ErrorRequestHandler)[]} [expressInstanceOrOptions.postMiddlewares] Express
 * middlewares to be executed after the controllers and hooks, but before the 500 or 404 handler get called.
 * @returns {Promise<ExpressApplication>} The express application.
 */
export async function createAndInitApp(
  rootControllerClass: Class, expressInstanceOrOptions?: ExpressApplication|CreateAppOptions
): Promise<ExpressApplication> {
  const app = createApp(rootControllerClass, expressInstanceOrOptions);

  const controller = app.foal.services.get(rootControllerClass);
  if (controller.init) {
    await controller.init();
  }

  return app;
}
