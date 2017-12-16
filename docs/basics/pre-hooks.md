# Pre-hooks

Pre-hooks are TypeScript decorators used on either a controller method, a controller class or in the `preHooks` attribute of a module. They're only executed when the regarded service is used as a controller. So if the method is called from an http request, the controller decorators will be executed. If it is called from the service itself or another one, they'll be skipped.

## How to create one

```ts
import {
  Context,
  Service,
  ServiceManager,
  preHook,
} from '@foal/core';

export function makeMyLoggerMiddleware(message: string): PreMiddleware {
  return function myLoggerMiddleware(ctx: Context, services: ServiceManager): void {
    console.log(message);
  };
}

export function myLoggerPreHook(message: string) {
  return preHook(makeMyLoggerMiddleware(message));
}


@Service()
@myLoggerPreHook('hello world')
class MyController {}

```

## Example

You can either bind your pre-hook to a controller method, its class or a module. Attaching a pre-hook to a class is equivalent to attaching it to all its methods. Providing a pre-hook to a module is equivalent to attaching it to all its controllers.

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

You can combine several pre-hooks into one thanks to `combinePreHooks`.

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

## Testing a pre-hook

To test a pre-hook you can test its middleware. So prefer separate its declaration from the pre-hook itself.

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

## Testing a controller with pre-hooks

When testing controller methods, pre-hooks are skipped. So with the previous example you have:

```ts
import { expect } from 'chai';

async function test() {
  const myController = new MyController();
  const actual = await myController.create({}, { query: {} });
  expect(actual).to.equal('Created');
}

test();
```
