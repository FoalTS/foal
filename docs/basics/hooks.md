# Hooks

Hooks are an elegant way to deal with access control, input validation or sanitization. A hook is a small function, synchronous or asynchronous, that aims to be connected to one, several or all the routes of a controller. There are two kinds of hooks:
- the pre-hooks which are executed before the routes handlers (defined by the controller factory)
- and the post-hooks which are executed after.

Pre-hooks are usually used to restrict access and to check and sanitize data received by the server. Post-hooks are less used and serve purpose such as removing critical fields before returning data to the client (ex: the password of the a user).

They takes two parameters:
- the `Context|PostContext` object which provides some information on the http request as well as the session object and the authenticated user if they exist. The post contexts also include a `result` property which may be undefined or a `HttpResponse` dependending on if the pre-hooks or route handler returned one.
- the service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or rejected) in a pre-hook then the processing of the request is stopped for the pre-hooks and route handler and the server responds with the `statusCode` and optional `content` of the returned object.

> *Note*: A pre-hook may also be registered within the `preHooks` property of a module. If so it applies to all the controllers of the modul

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

## How to bind the hook to a route.

Hooks can either be bound to one, several or all the routes of a controller. They may even apply to all the controllers of a module and its child modules if you register it within the `preHooks` property of the top-level module.

### Specific routes of a controller

Each controller factory gives a different name to each of its route.

```typescript
import { rest } from '@foal/common';
import {
  Module,
  PreHook
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
    rest
      .attachService('/', MyModelService)
      .withPreHook(logContext, 'getAll', 'getById')
      // or withPreHooks([ logContext ], 'getAll', 'getById')
      .withPreHook(ctx => { console.log('Second pre-hook executed!'); }, 'getAll', 'getById')
      .withPostHook(logPostContext, 'getAll', 'getById')
      // or withPostHooks([ logContext ], 'getAll', 'getById')
  ]
}
```

### All the routes of a controller

```typescript
import { rest } from '@foal/common';
import {
  Module,
  PreHook
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
    rest
      .attachService('/', MyModelService)
      .withPreHook(logContext)
      .withPreHook(ctx => { console.log('Second pre-hook executed!'); })
      // or withPreHooks([ logContext ])
      .withPostHook(logPostContext)
      // or withPostHooks([ logContext ], 'getAll', 'getById')
  ]
}
```

### All the routes of all the controllers of a module and its children

```typescript
import { rest } from '@foal/common';
import {
  Module,
  PreHook
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
    rest
      .attachService('/', MyModelService), 
  ]
}

export const MyModule: Module = {
  controllers: [
    rest
      .attachService('/foo', MyModelService),
    rest
      .attachService('/bar', MyModelService2),
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

You can combine several hooks into one thanks to `combineHooks`.

```typescript
import { combineHooks } from '@foal/core';

function myCombinedPreHooks() {
  return combineHooks([
    myPreHook1()
    myPreHook2()
  ])
}

```

## Testing a hook

Hooks are just mere functions. Test them as this.

```typescript
import {
  createEmptyContext,
  PreHook,
  ServiceManager
} from '@foal/core';
import * as expect from 'chai';

const preHook: PreHook = ctx => { ctx.state.foo = 'bar'; };

describe('preHook', () => {
  
  it('should add a foo property to the context state.', () => {
    const ctx = createEmptyContext();
    
    preHook(ctx, new ServiceManager());

    expect(ctx.state.foo).to.equal('bar');
  })

});

```
