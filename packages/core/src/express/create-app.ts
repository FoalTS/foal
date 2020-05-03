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

export type ExpressApplication = any;

type Middleware = (req: any, res: any, next: (err?: any) => any) => any;
type ErrorMiddleware = (err: any, req: any, res: any, next: (err?: any) => any) => any;

export interface CreateAppOptions {
  expressInstance?: any;
  methods?: {
    handleError?: boolean;
  };
  serviceManager?: ServiceManager;
  preMiddlewares?: (Middleware|ErrorMiddleware)[];
  postMiddlewares?: (Middleware|ErrorMiddleware)[];
}

function handleJsonErrors(err: any, req: any, res: any, next: (err?: any) => any) {
  if (err.type !== 'entity.parse.failed') {
    next(err);
    return;
  }
  res.status(err.status).send({
    body: err.body,
    message: err.message
  });
}

function protectionHeaders(req: any, res: any, next: (err?: any) => any) {
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-DNS-Prefetch-Control', 'off');
  res.setHeader('X-Download-Options', 'noopen');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=15552000; includeSubDomains');
  next();
}

function getOptions(expressInstanceOrOptions?: any|CreateAppOptions): CreateAppOptions {
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
 * @param {(any|CreateAppOptions)} [expressInstanceOrOptions] - Express instance or options containaining
 * Express middlewares or other settings.
 * @param {any} [expressInstanceOrOptions.expressInstance] - Express instance to be used as base for the
 * returned application.
 * @param {boolean} [expressInstanceOrOptions.methods.handleError] - Specifies if AppController.handleError should be
 * used to handle errors.
 * @param {ServiceManager} [expressInstanceOrOptions.serviceManager] - Prebuilt and configured Service Manager for
 * optionally overriding the mapped identities.
 * @param {(RequestHandler | ErrorRequestHandler)[]} [expressInstanceOrOptions.preMiddlewares] Express
 * middlewares to be executed before the controllers and hooks.
 * @param {(RequestHandler | ErrorRequestHandler)[]} [expressInstanceOrOptions.postMiddlewares] Express
 * middlewares to be executed after the controllers and hooks, but before the 500 or 404 handler get called.
 * @returns {any} The express application.
 */
export function createApp(
  AppController: Class,
  expressInstanceOrOptions?: any | CreateAppOptions,
): any {
  const options = getOptions(expressInstanceOrOptions);
  const app = options.expressInstance || express();

  // Add optional pre-middlewares.
  for (const middleware of options.preMiddlewares || []) {
    app.use(middleware);
  }

  // Log requests.
  const loggerFormat = Config.get2(
    'settings.loggerFormat',
    'string',
    '[:date] ":method :url HTTP/:http-version" :status - :response-time ms'
  );
  if (loggerFormat !== 'none') {
    app.use(logger(loggerFormat));
  }

  app.use(protectionHeaders);

  // Serve static files.
  app.use(
    Config.get2('settings.staticPathPrefix', 'string', ''),
    express.static(Config.get2('settings.staticPath', 'string', 'public'))
  );

  // Parse request body.
  const limit = Config.get2('settings.bodyParser.limit', 'number|string');
  app.use(express.json({ limit }));
  app.use(handleJsonErrors);
  app.use(express.urlencoded({ extended: false, limit }));
  app.use(express.text({ type: ['text/*', 'application/graphql'], limit }));

  // Parse cookies.
  app.use(cookieParser());

  // Create the service and controller manager.
  const services = options.serviceManager || new ServiceManager();
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
  const controller = app.foal.services.get(AppController);
  app.use(handleErrors(options, controller));

  return app;
}

/**
 * Create an Express application from the root controller and call its "init" method if it exists.
 *
 * @export
 * @param {Class} AppController - The root controller, usually called `AppController` and located in `src/app`.
 * @param {(any|CreateAppOptions)} [expressInstanceOrOptions] - Express instance or options containaining
 * Express middlewares or other settings.
 * @param {any} [expressInstanceOrOptions.expressInstance] - Express instance to be used as base for the
 * returned application.
 * @param {boolean} [expressInstanceOrOptions.methods.handleError] - Specifies if AppController.handleError should be
 * used to handle errors.
 * @param {ServiceManager} [expressInstanceOrOptions.serviceManager] - Prebuilt and configured Service Manager for
 * optionally overriding the mapped identities.
 * @param {(RequestHandler | ErrorRequestHandler)[]} [expressInstanceOrOptions.preMiddlewares] Express
 * middlewares to be executed before the controllers and hooks.
 * @param {(RequestHandler | ErrorRequestHandler)[]} [expressInstanceOrOptions.postMiddlewares] Express
 * middlewares to be executed after the controllers and hooks, but before the 500 or 404 handler get called.
 * @returns {Promise<any>} The express application.
 */
export async function createAndInitApp(
  AppController: Class, expressInstanceOrOptions?: any | CreateAppOptions
): Promise<any> {
  const app = createApp(AppController, expressInstanceOrOptions);

  const controller = app.foal.services.get(AppController);
  if (controller.init) {
    await controller.init();
  }

  return app;
}
