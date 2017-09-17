import { newExpressDecorator } from '../factories';
import { ExpressContextDef } from '../interfaces';

export function addToContextFromExpress(contextDef: ExpressContextDef) {
  return newExpressDecorator((req, res, next) => {
    next();
  }, contextDef);
}
