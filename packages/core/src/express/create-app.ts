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

function handleJsonErrors(err, _, res, next) {
  if (err.type !== 'entity.parse.failed') {
    next(err);
    return;
  }
  res.status(err.status).send({
    body: err.body,
    message: err.message
  });
}

function protectionHeaders(_, res, next) {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  next();
}

function getOptions(expressInstanceOrOptions?: ExpressApplication|CreateAppOptions): CreateAppOptions {
  if (!expressInstanceOrOptions) {
    return {};
  }

  if (typeof expressInstanceOrOptions === 'function') {
    return { expressInstance: expressInstanceOrOptions };
  }

  return expressInstanceOrOptions;
}

/**
 * Create an Express application from the root controller.
 *
 * @export
 * @param {Class} AppController - The root controller, usually called `AppController` and located in `src/app`.
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
  AppController: Class, expressInstanceOrOptions?: ExpressApplication|CreateAppOptions
): ExpressApplication {
  const options = getOptions(expressInstanceOrOptions);
  const app: ExpressApplication = options.expressInstance || express();

  // Add optional pre-middlewares.
  for (const middleware of options.preMiddlewares || []) {
    app.use(middleware);
  }

  // Log requests.
  const loggerFormat: string = Config.get(
    'settings.loggerFormat',
    '[:date] ":method :url HTTP/:http-version" :status - :response-time ms'
  );
  if (loggerFormat !== 'none') {
    app.use(logger(loggerFormat));
  }

  app.use(protectionHeaders);

  // Serve static files.
  app.use(
    Config.get('settings.staticPathPrefix', ''),
    express.static(Config.get('settings.staticPath', 'public'))
  );

  // Parse request body.
  app.use(express.json());
  app.use(handleJsonErrors);
  app.use(express.urlencoded({ extended: false }));
  app.use(express.text({ type: ['text/*', 'application/graphql'] }));

  // Parse cookies.
  app.use(cookieParser());

  // Create the service and controller manager.
  const services = new ServiceManager();
  app.foal = { services };

  // Resolve the controllers and hooks and add them to the express instance.
  const routes = makeControllerRoutes('', [], AppController, services);
  for (const route of routes) {
    app[route.httpMethod.toLowerCase()](route.path, createMiddleware(route, services));
  }

  // Add optional post-middlewares.
  for (const middleware of options.postMiddlewares || []) {
    app.use(middleware);
  }

  // Handle errors.
  app.use(notFound());
  app.use(handleErrors());

  return app;
}

/**
 * Create an Express application from the root controller and call its "init" method if it exists.
 *
 * @export
 * @param {Class} AppController - The root controller, usually called `AppController` and located in `src/app`.
 * @param {(ExpressApplication|CreateAppOptions)} [expressInstanceOrOptions] - Express instance or options containaining
 * Express middlewares.
 * @param {(express.RequestHandler | express.ErrorRequestHandler)[]} [expressInstanceOrOptions.preMiddlewares] Express
 * middlewares to be executed before the controllers and hooks.
 * @param {(express.RequestHandler | express.ErrorRequestHandler)[]} [expressInstanceOrOptions.postMiddlewares] Express
 * middlewares to be executed after the controllers and hooks, but before the 500 or 404 handler get called.
 * @returns {Promise<ExpressApplication>} The express application.
 */
export async function createAndInitApp(
  AppController: Class, expressInstanceOrOptions?: ExpressApplication|CreateAppOptions
): Promise<ExpressApplication> {
  const app = createApp(AppController, expressInstanceOrOptions);

  const controller = app.foal.services.get(AppController);
  if (controller.init) {
    await controller.init();
  }

  return app;
}
