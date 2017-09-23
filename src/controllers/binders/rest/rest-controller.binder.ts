import * as express from 'express';

import { ExpressContextDef, ExpressMiddleware } from '../../interfaces';
import { ControllerBinder } from '../controller.binder';

import { getDeleteHandler, getGetHandler, getPatchHandler, getPostHandler, getPutHandler } from './handlers';
import { RestController } from './rest-controller.interface';

export class RestBinder extends ControllerBinder<RestController> {
  protected expressRouter(
    path: string,
    controller: RestController,
    getExpressMiddlewares: (methodName: string, defaultContextDef?: ExpressContextDef) => ExpressMiddleware[]
  ): any {
    const router = express.Router();
    // Are we good with myPath////toto?

    const defaultcontextDef: ExpressContextDef = [
      { req: 'body', ctx: 'data' },
      { req: 'params.id', ctx: 'id' },
      { req: 'query', ctx: 'params.query' }
    ];

    router.route(path)
      .get(getExpressMiddlewares('get', defaultcontextDef), getGetHandler(controller))
      .post(getExpressMiddlewares('create', defaultcontextDef), getPostHandler(controller));

    router.route(`${path}/:id`)
      .delete(getExpressMiddlewares('delete', defaultcontextDef), getDeleteHandler(controller))
      .get(getExpressMiddlewares('get', defaultcontextDef), getGetHandler(controller))
      .patch(getExpressMiddlewares('patch', defaultcontextDef), getPatchHandler(controller))
      .put(getExpressMiddlewares('update', defaultcontextDef), getPutHandler(controller));

    return router;
  }
}

export const rest = new RestBinder();
