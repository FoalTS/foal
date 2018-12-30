# Hooks

```sh
foal generate hook my-hook
```

Hooks are decorators that execute extra logic before and/or after the method execution.

They are particulary useful in these scenarios:
- authentication & access control
- request validation & sanitization
- logging

They improve code readability and make unit testing easier.

## Structure

A hook is made of small function, synchronous or asynchronous, that is executed before the controller method.

This function takes two parameters:
- The `Context` object which provides some information on the http request as well as the authenticated user if it exists.
- The service manager that lets access other services within the hook.

It may return an `HttpResponse` object. If so, the remaining hooks and the controller method are not executed, and the server responds with this response.

It may also return an `HookPostFunction` that will be executed after the method execution. This takes three parameters: the context, the service manager and the response returned by the controller method.

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
- `LoginRequired` and `LoginOptional` authenticate the user by filling the `ctx.user` property.
- `PermissionRequired` restricts the route access to certain users.

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

export function LogExecutionTime() {
  return Hook(() => {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime(); 
    return () => {
      const diff = process.hrtime(time);
      console.log(`Benchmark took ${diff[0] * NS_PER_SEC + diff[1]} nanoseconds`);
    };
  })
}

```

## How to bind the hook to a route

Hooks can either be bound to one, several or all the routes of a controller.

```typescript
import { Get, HttpResponseOK } from '@foal/core';

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
export class AppController {
  subControllers = [
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
