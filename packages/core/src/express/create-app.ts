// 3p
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as logger from 'morgan';

// FoalTS
import {
  Class,
  Config,
  Context,
  getResponse,
  IAppController,
  makeControllerRoutes,
  OpenApi,
  ServiceManager,
} from '../core';
import { sendResponse } from './send-response';

export const OPENAPI_SERVICE_ID = 'OPENAPI_SERVICE_ID_a5NWKbBNBxVVZ';

type Middleware = (req: any, res: any, next: (err?: any) => any) => any;
type ErrorMiddleware = (err: any, req: any, res: any, next: (err?: any) => any) => any;

export interface CreateAppOptions {
  expressInstance?: any;
  serviceManager?: ServiceManager;
  preMiddlewares?: (Middleware|ErrorMiddleware)[];
  afterPreMiddlewares?: (Middleware|ErrorMiddleware)[];
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
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
}

/**
 * Create an Express application from the root controller.
 *
 * @export
 * @param {Class<IAppController>} AppController - The root controller, usually called `AppController`
 * and located in `src/app`.
 * @param {CreateAppOptions} [options] - Options containaining Express middlewares or other settings.
 * @param {any} [options.expressInstance] - Express instance to be used as base for the
 * returned application.
 * @param {boolean} [options.methods.handleError] - Specifies if AppController.handleError should be
 * used to handle errors.
 * @param {ServiceManager} [options.serviceManager] - Prebuilt and configured Service Manager for
 * optionally overriding the mapped identities.
 * @param {(RequestHandler | ErrorRequestHandler)[]} [options.preMiddlewares] Express
 * middlewares to be executed before the controllers and hooks.
 * @param {(RequestHandler | ErrorRequestHandler)[]} [options.postMiddlewares] Express
 * middlewares to be executed after the controllers and hooks, but before the 500 or 404 handler get called.
 * @returns {Promise<any>} The express application.
 */
export async function createApp(
  AppController: Class<IAppController>,
  options: CreateAppOptions = {},
): Promise<any> {
  const app = options.expressInstance || express();

  // Add optional pre-middlewares.
  for (const middleware of options.preMiddlewares || []) {
    app.use(middleware);
  }

  // Log requests.
  const loggerFormat = Config.get(
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
    Config.get('settings.staticPathPrefix', 'string', ''),
    express.static(Config.get('settings.staticPath', 'string', 'public'))
  );

  // Parse request body.
  const limit = Config.get('settings.bodyParser.limit', 'number|string');
  app.use(express.json({ limit }));
  app.use(handleJsonErrors);
  app.use(express.urlencoded({ extended: false, limit }));
  app.use(express.text({ type: ['text/*', 'application/graphql'], limit }));

  // Parse cookies.
  app.use(cookieParser(Config.get('settings.cookieParser.secret', 'string')));

  // Add optional after pre-middlewares.
  for (const middleware of options.afterPreMiddlewares || []) {
    app.use(middleware);
  }

  // Create the service and controller manager.
  const services = options.serviceManager || new ServiceManager();
  app.foal = { services };

  // Inject the OpenAPI service with an ID string to avoid duplicated singletons
  // across several npm packages.
  services.set(OPENAPI_SERVICE_ID, services.get(OpenApi));

  // Retrieve the AppController instance.
  const appController = services.get<IAppController>(AppController);

  // Resolve the controllers and hooks and add them to the express instance.
  const routes = makeControllerRoutes(AppController, services);
  for (const { route } of routes) {
    app[route.httpMethod.toLowerCase()](route.path, async (req: any, res: any, next: (err?: any) => any) => {
      try {
        const ctx = new Context(req);
        // TODO: better test this line.
        const response = await getResponse(route, ctx, services, appController);
        sendResponse(response, res);
      } catch (error: any) {
        // This try/catch will never be called: the `getResponse` function catches any errors
        // thrown or rejected in the application and converts it into a response.
        // However, for more security, this line has been added to avoid crashing the server
        // in case the function is badly implemented.
        next(error);
      }
    });
  }

  // Add optional post-middlewares.
  for (const middleware of options.postMiddlewares || []) {
    app.use(middleware);
  }

  await services.boot();

  if (appController.init) {
    await appController.init();
  }

  return app;
}
