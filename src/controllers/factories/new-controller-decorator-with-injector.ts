import { Injector } from '../../di/injector';
import { Decorator, ExpressContextDef, Family } from '../interfaces';
import { defineMetadata, getMetadata } from './helpers';

export function newControllerDecoratorWithInjector(family: Family, hook: (injector: Injector) => any,
                                                   contextDef?: ExpressContextDef): Decorator {
  return function decorator(target: any, methodName?: string) {
    if (family === 'contextual') {
      const expressHooks = getMetadata('hooks:express', target, methodName);
      if (expressHooks) {
        console.log(`WARNING: contextual decorators should be specified after express hooks.`);
      }
    }
    const hooks = getMetadata(`hooks:${family}`, target, methodName) || [];
    hooks.unshift(hook);
    defineMetadata(`hooks:${family}`, hooks, target, methodName);

    if (contextDef) {
      // Irrelevant if family === 'contextual'
      let contextDef2 = getMetadata(`contextDef:${family}`, target, methodName) || [];
      contextDef2 = contextDef2.concat(contextDef);
      defineMetadata(`contextDef:${family}`, contextDef2, target, methodName);
    }
  };
}
