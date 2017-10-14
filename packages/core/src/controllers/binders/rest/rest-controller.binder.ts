import * as express from 'express';

import { ExpressMiddleware } from '../../interfaces';
import { ControllerBinder } from '../controller.binder';

import { getDeleteHandler, getGetAllHandler, getGetHandler, getPatchHandler,
  getPostHandler, getPutHandler } from './handlers';
import { RestController } from './rest-controller.interface';

export class RestBinder extends ControllerBinder<RestController> {
  protected expressRouter(
    path: string,
    controller: RestController,
    getExpressMiddlewares: (methodName: string) => ExpressMiddleware[]
  ): any {
    const router = express.Router();
    // Are we good with myPath////toto?

    router.route(path)
      .get(getExpressMiddlewares('getAll'), getGetAllHandler(controller))
      .post(getExpressMiddlewares('create'), getPostHandler(controller));

    router.route(`${path}/:id`)
      .delete(getExpressMiddlewares('delete'), getDeleteHandler(controller))
      .get(getExpressMiddlewares('get'), getGetHandler(controller))
      .patch(getExpressMiddlewares('patch'), getPatchHandler(controller))
      .put(getExpressMiddlewares('update'), getPutHandler(controller));

    return router;
  }
}

export const rest = new RestBinder();
