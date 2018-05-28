# Hooks

TODO: explain conventions with onSuccess, onError, onClientError and onServorError.

Hooks are an elegant way to deal with access control, input validation or sanitization. A hook is a small function, synchronous or asynchronous, that aims to be connected to one, several or all the routes of a controller. There are two kinds of hooks:
- the pre-hooks which are executed before the routes handlers (defined by the controller factory)
- and the post-hooks which are executed after.

Pre-hooks are usually used to restrict access or to check and sanitize data received by the server. Post-hooks are less used and serve purpose such as removing critical fields before returning data to the client (ex: the password of a user).

They takes two parameters:
- the `Context|PostContext` object which provides some information on the http request as well as the session object and the authenticated user if they exist. The post contexts also include a `response` property which may be undefined or an `HttpResponse` dependending on if the pre-hooks or route handler returned one.
- The service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or resolved) in a pre-hook then the processing of the request is stopped for the pre-hooks and route handler and the server responds with the `statusCode` and optional `content` of the returned object.

> *Note*: A pre-hook (or post-hook) may also be registered within the `preHooks` (or `postHooks`) property of a module. If so it applies to all the controllers of the module.

## How to create one

```typescript
import {
  Context,
  PostContext,
  ServiceManager,
  PostHook,
  PreHook,
} from '@foal/core';

export function myLoggerPreHook(message: string): PreHook {
  return (ctx: Context, services: ServiceManager) => { console.log(message) };
}

export function myLoggerPostHook(message: string): PostHook {
  return (ctx: PostContext, services: ServiceManager) => { console.log(message) };
}
```

## How to bind the hook to a route

Hooks can either be bound to one, several or all the routes of a controller. They may even apply to all the controllers of a module and its child modules if you register it within the `preHooks` or `postHooks` properties of the top-level module.

### Specific routes of a controller

Each controller factory gives a different name to each of its route.

```typescript
import {
  Module,
  PreHook,
  rest
} from '@foal/core';

import { MyModelService } from './my-model-service';

const logContext: PreHook = ctx => {
  console.log(ctx);
}

const logPostContext: PostHook = ctx => {
  console.log(ctx);
}

export const MyModule: Module = {
  controllers: [
    rest('/', MyModelService)
      .withPreHook(logContext, 'GET /', 'GET /:id')
      // or withPreHooks([ logContext ], 'GET /', 'GET /:id')
      .withPreHook(ctx => { console.log('Second pre-hook executed!'); }, 'GET /', 'GET /:id')
      .withPostHook(logPostContext, 'GET /', 'GET /:id')
      // or withPostHooks([ logContext ], 'GET /', 'GET /:id')
  ]
}
```

### All the routes of a controller

```typescript
import {
  Module,
  PreHook,
  rest
} from '@foal/core';

import { MyModelService } from './my-model-service';

const logContext: PreHook = ctx => {
  console.log(ctx);
}

const logPostContext: PostHook = ctx => {
  console.log(ctx);
}

export const MyModule: Module = {
  controllers: [
    rest('/', MyModelService)
      .withPreHook(logContext)
      .withPreHook(ctx => { console.log('Second pre-hook executed!'); })
      // or withPreHooks([ logContext ])
      .withPostHook(logPostContext)
      // or withPostHooks([ logContext ])
  ]
}
```

### All the routes of all the controllers of a module and its children

```typescript
import {
  Module,
  PreHook,
  rest
} from '@foal/core';

import { MyModelService } from './my-model-service';
import { MyModelService2 } from './my-model-service2';
import { MyModelService3 } from './my-model-service2';

const logContext: PreHook = ctx => {
  console.log(ctx);
}

const logPostContext: PostHook = ctx => {
  console.log(ctx);
}

export const ChildModule: Module = {
  path: '/foobar',
  controllers: [
    rest('/', MyModelService), 
  ]
}

export const MyModule: Module = {
  controllers: [
    rest('/foo', MyModelService),
    rest('/bar', MyModelService2),
  ],
  modules: [
    ChildModule
  ]
  preHooks: [
    logContext,
    ctx => { console.log('Second pre-hook executed!'); }
  ],
  postHooks: [
    logPostContext
  ]
}
```

## Combination

You can combine several hooks into one with `combinePreHooks` and `combinePostHooks`.

```typescript
import { combinePreHooks } from '@foal/core';

function myCombinedPreHooks() {
  return combinePreHooks([
    myPreHook1()
    myPreHook2()
  ])
}

```

## Testing a hook

Hooks are just mere functions. Test them as is.

```typescript
import {
  Context,
  PreHook,
  ServiceManager
} from '@foal/core';
import * as expect from 'chai';

const preHook: PreHook = ctx => { ctx.state.foo = 'bar'; };

describe('preHook', () => {
  
  it('should add a foo property to the context state.', () => {
    const ctx = Context();
    
    preHook(ctx, new ServiceManager());

    expect(ctx.state.foo).to.equal('bar');
  })

});

```
