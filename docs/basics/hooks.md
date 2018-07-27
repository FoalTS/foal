# Hooks

// Add a little get-started (some code or a cli command)

```sh
foal generate hook my-hook
```

> Difference between a hook and an express middleware?
> - sync or async
> - do not use res, but return, resolves a HttpResponse
> - pas de next. Si pas de valeur retounée ou d'erreur levée/rejetée, on va à l'étape suivante
> - ctx est un peu différent de req avec le state notamment
> - purpose: not to be at the end of the chain. It's really in the middle.

Example : `ValidateBody` to validate the format of the request body, `PermissionRequired` or `LoginRequired` to restrict the route access to certain users.

Hooks are an elegant way to deal with access control, input validation or sanitization. A hook is a small function, synchronous or asynchronous, that aims to be connected to one, several or all the routes of a controller.

Hooks are usually used to restrict access or to check and sanitize data received by the server.

<!-- > By convention post-hook names should start with `onSuccess`, `onError`, `onClientError` or `onServorError` if they are dealing only with some subclasses of `HttpResponse`.-->

They takes two parameters:
- the `Context|PostContext` object which provides some information on the http request as well as the session object and the authenticated user if they exist.
- The service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or resolved) in a hook then the processing of the request is stopped for the hooks and controller method and the server responds with the `statusCode` and optional `content` of the returned object.

> *Note*: A hook may also decorate a module. If so it applies to all the controllers of the module.

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
      .withPreHook(ctx => { console.log('Second hook executed!'); }, 'GET /', 'GET /:id')
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
      .withPreHook(ctx => { console.log('Second hook executed!'); })
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
    ctx => { console.log('Second hook executed!'); }
  ],
  postHooks: [
    logPostContext
  ]
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
