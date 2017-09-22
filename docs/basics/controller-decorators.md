# Controller decorators

Controller decorators are TypeScript decorators used on either a controller method, a controller class or in the sharedControllerDecorators attribute of a module. They're only executed when the regarded service is used as a controller. So if the method is called from an http request, the controller decorators will be executed. If it is called from the service itself or another one, they'll be skipped.

## Families

There are two families: framework controller decorators and contextual controller decorators. The first ones are specific to express (or socket.io in the future). The other ones work with a `context`.

Examples on how to create them:
```ts
import {
  Injectable,
  Injector,
  newContextualDecorator,
  newContextualDecoratorWithInjector,
  newExpressDecorator,
  newExpressDecoratorWithInjector
} from '@foal/core';

function myExpressMiddleware(req: any, res: any, next: Function) {
  console.log('First decorator');
  next();
}

function myExpressMiddleware2(req: any, res: any, next: Function) {
  console.log('Second decorator');
  next();
}

function myExpressHook(injector: Injector) {
  // The injector lets you call another service directly in the decorator. It may be
  // useful to check that a user has permission to access a method.
  return myExpressMiddleware2;
}

async function myContextualMiddleware(ctx: any): Promise<any> {
  console.log('Third decorator');
  return ctx;
}

async function myContextualMiddleware2(ctx: any): Promise<any> {
  console.log('Fourth decorator');
  return ctx;
}

function myContextualHook(injector: Injector) {
  // The injector lets you call another service directly in the decorator. It may be
  // useful to check that a user has permission to access a method.
  return myExpressMiddleware2;
}

@Injectable()
@newExpressDecorator(myExpressMiddleware)
@newExpressDecoratorWithInjector(myExpressHook)
// Contextual decorators are executed after framework decorators
@newContextualDecorator(myContextualMiddleware)
@newContextualDecoratorWithInjector(myContextualHook)
class MyController {}

```

## Example

You can either bind your decorator to a controller method, its class or a module. Attaching a decorator to a class is equivalent to attaching it to all its methods. Providing a decorator to a module is equivalent to attaching it to all its controllers.

```ts
// Import an express middleware to display request details
import * as morgan from 'morgan';

import { Injectable, newExpressControllerDecorator, newFoalControllerDecorator, RestController } from '@foal/core';

function contextLogger(context: any): Promise<any> {
  console.log(context);
  return params;
}

@Injectable()
class MyController extends RestController {
  constructor() {}

  @newExpressControllerDecorator(morgan)
  @newFoalControllerDecorator(contextLogger)
  async create(data: any, params: RestParams): Promise<any> {
    return 'Created';
  }
}
```

## Testing a controller decorator

To test a controller decorator you can either test its hook or middleware.

## Testing a controller with decorators

When testing controller methods, decorators are skipped. So with the previous example you have:

```ts
import { expect } from 'chai';

const myController = new MyController();
const actual = myController.create({}, { query: {} });
expect(actual).to.equal('Created');
```