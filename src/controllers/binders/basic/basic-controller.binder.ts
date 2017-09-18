import { Request, Response, Router } from 'express';

import { BasicController } from './basic-controller.interface';

import { NotImplementedError } from '../../errors';
import { ExpressMiddleware } from '../../interfaces';
import { catchErrors } from '../../utils';
import { ControllerBinder } from '../controller.binder';

export class BasicBinder extends ControllerBinder<BasicController> {
  protected expressRouter(
    path: string,
    controller: BasicController,
    getExpressMiddlewares: (methodName: string) => ExpressMiddleware[]
  ): Router {
    const router = Router();
    // Use a type to have type check inside router[method]
    type MethodName = 'post'|'get'|'patch'|'put'|'delete';
    const methods: MethodName[] = ['post', 'get', 'patch', 'put', 'delete'];

    methods.forEach(method => {
      router[method](path, getExpressMiddlewares(method), catchErrors((req: Request, res: Response) => {
        if (!controller[method]) {
          throw new NotImplementedError();
        }
        // Typescript bug here "error TS2532: Object is possibly 'undefined'"
        // whereas we have the conditional above. Use (as any) as hack.
        (controller[method] as (req: Request, res: Response) => any)(req, res);
      }));
    });

    return router;
  }
}

export const basic = new BasicBinder();
