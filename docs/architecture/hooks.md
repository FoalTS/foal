# Hooks

```sh
foal generate hook my-hook
```

Hooks are an elegant way to deal with access control, input validation or sanitization. A hook is made of small function, synchronous or asynchronous, that aims to be executed before a controller method.

This function takes two parameters:
- The `Context` object which provides some information on the http request as well as the session object and the authenticated user if they exist.
- The service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or resolved) in a hook then the processing of the request is stopped for the hooks and controller method and the server responds with the `statusCode` and optional `content` of the returned object.

<!--
// TODO: Write this.
> Difference between a hook and an express middleware?
> - sync or async
> - do not use res, but return, resolves a HttpResponse
> - pas de next. Si pas de valeur retounée ou d'erreur levée/rejetée, on va à l'étape suivante
> - ctx est un peu différent de req avec le state notamment
> - purpose: not to be at the end of the chain. It's really in the middle.
>
-->

<!-- > By convention post-hook names should start with `onSuccess`, `onError`, `onClientError` or `onServorError` if they are dealing only with some subclasses of `HttpResponse`.-->

## Some common hooks

- `ValidateBody` validates the format of the request body.
- `PermissionRequired` or `LoginRequired` restrict the route access to certain users.

## How to create one

```typescript
import {
  Context,
  ServiceManager,
  Hook
} from '@foal/core';

export function HelloWorld(smiley: string){
  return Hook((ctx: Context, services: ServiceManager) => {
    console.log('Hello world ' + smiley);
  });
}

```

## How to bind the hook to a route

Hooks can either be bound to one, several or all the routes of a controller. They may even apply to all the controllers of a module and its sub-modules.

```typescript
import {
  Get, HttpResponseOK, IModule
} from '@foal/core';

import { HelloWorld } from './hello-world.hook';

@HelloWorld(':)')
class MyController {
  @Get('/foo')
  @HelloWorld(':/')
  foo() {
    return new HttpResponseOK();
  }

  @Get('/bar')
  bar() {
    return new HttpResponseOK();
  }
}

class MyController2 {
  @Get('/foobar')
  foobar() {
    return new HttpResponseOK();
  }
}

@HelloWorld(':D')
export class AppModule implements IModule {
  controllers = [
    controller('/a', MyController),
    controller('/b', MyController2)
  ]
}

/*
GET /a/foo
"Hello world :D"
"Hello world :)"
"Hello world :/"

GET /a/bar
"Hello world :D"
"Hello world :)"

GET /b/foobar
"Hello world :D"
*/

```

## Testing a hook

```typescript
// std
import { strictEqual } from 'assert';

// 3p
import {
  Context,
  getHookFunction,
  Hook,
  ServiceManager
} from '@foal/core';

function MyHook() {
  return Hook(ctx => {
    ctx.state.foo = 'bar';
  });
}

describe('preHook', () => {
  
  it('should add a foo property to the context state.', () => {
    const ctx = Context();
    const hook = getHookFunction(MyHook())
    
    hook(ctx, new ServiceManager());

    strictEqual(ctx.state.foo, 'bar');
  })

});

```
