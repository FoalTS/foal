# Hooks

Hooks are TypeScript decorators used on either a controller method, a controller class or in the `hooks` attribute of a module. They're only executed when the regarded service is used as a controller. So if the method is called from an http request, the controller decorators will be executed. If it is called from the service itself or another one, they'll be skipped.

They are two types of hooks: pre-hooks which are executed before the controller method (ex: access control, data parser) and post-hooks which are executed after (ex: remove some attributes before returning an object to the client).

## How to create one

```typescript
import {
  Context,
  PreMiddleware,
  PostMiddleware,
  Service,
  ServiceManager,
  postHook,
  preHook,
} from '@foal/core';

export function makeMyPreLoggerMiddleware(message: string): PreMiddleware {
  return function myPreLoggerMiddleware(ctx: Context, services: ServiceManager): void {
    console.log(message);
  };
}

export function myPreLoggerPreHook(message: string) {
  return preHook(makeMyPreLoggerMiddleware(message));
}

export function makeMyPostLoggerMiddleware(message: string): PreMiddleware {
  return function myPostLoggerMiddleware(ctx: Context, services: ServiceManager): void {
    console.log(message);
  };
}

export function myPostLoggerPreHook(message: string) {
  return preHook(makeMyPostLoggerMiddleware(message));
}

@Service()
@myPreLoggerPreHook('hello world')
@myPostLoggerPreHook('hello world (post)')
class MyController {}

```

## Example

You can either bind your hook to a controller method, its class or a module. Attaching a hook to a class is equivalent to attaching it to all its methods. Providing a hook to a module is equivalent to attaching it to all its controllers.

```ts
import { Context, Service, preHook, RestController } from '@foal/core';

function contextLogger(context: Context): Promise<any> {
  console.log(context);
}

@Service()
class MyController extends RestController {
  constructor() {}

  @preHook(contextLogger)
  async create(data: any, params: RestParams): Promise<any> {
    return 'Created';
  }
}
```

## Combination

You can combine several hooks into one thanks to `combinePreHooks` and `combinePostHooks`.

```ts
import { combinePreHooks, Service, RestController } from '@foal/core';

function myCombinedPreHooks() {
  return combinePreHooks([
    myPreHook1()
    myPreHook2()
  ])
}

@Service()
@myCombinedPreHooks()
export class Foobar implements RestController {
  constructor() {}
}

```

## Testing a hook

To test a hook you can test its middleware. So prefer separate its declaration from the hook itself.

DON'T DO:
```ts
function addHelloWorldToContext() {
  return preHook((ctx: Context) => ctx.helloWorld = 'Hello world');
}
```

DO:
```ts
function addHelloWorldToContextMiddleware(ctx: Context) {
  ctx.helloWorld = 'Hello world';
}

function addHelloWorldToContext() {
  return preHook(addHelloWorldToContextMiddleware);
}
```

## Testing a controller with hooks

When testing controller methods, hooks are skipped. So with the previous example you have:

```ts
import { expect } from 'chai';

async function test() {
  const myController = new MyController();
  const actual = await myController.create({}, { query: {} });
  expect(actual).to.equal('Created');
}

test();
```
