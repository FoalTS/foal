# Hooks

Hooks are TypeScript decorators used on either a service method, a service class or in the `hooks` attribute of a module. They're only executed when the regarded service is used by a controller. So if the method is called from an http request, the controller decorators will be executed. If it is called from the service itself or another one, they'll be skipped.

They are two types of hooks: `pre-hooks` which are executed before the service method (ex: access control, data parser) and `post-hooks` which are executed after (ex: remove some attributes before returning an object to the client). By convention, post-hooks should start with `afterThat`.

## How to create one

```typescript
import {
  Context,
  Service,
  ServiceManager,
  postHook,
  preHook,
} from '@foal/core';

export function myLoggerPreHook(message: string) {
  return preHook((ctx: Context, services: ServiceManager) => console.log(message));
}

export function myLoggerPostHook(message: string) {
  return postHook((ctx: Context, services: ServiceManager) => console.log(message));
}

@Service()
@myLoggerPreHook('hello world')
@myLoggerPostHook('hello world (post)')
class MyController {}

```

## Example

You can either bind your hook to a controller method, its class or a module. Attaching a hook to a class is equivalent to attaching it to all its methods. Providing a hook to a module is equivalent to attaching it to all its controllers.

```typescript
import { PartialCRUDService } from '@foal/common';
import { Context, ObjectType, preHook, Service } from '@foal/core';

function contextLogger(context: Context): Promise<any> {
  console.log(context);
}

@Service()
class MyController extends PartialCRUDService {
  constructor() {}

  @preHook(contextLogger)
  public create(data: any, query: ObjectType): string {
    return 'Created';
  }
}
```

## Combination

You can combine several hooks into one thanks to `combineHooks`.

```typescript
import { PartialCRUDService } from '@foal/common';
import { combineHooks, Service } from '@foal/core';

function myCombinedPreHooks() {
  return combineHooks([
    myPreHook1()
    myPreHook2()
  ])
}

@Service()
@myCombinedPreHooks()
export class Foobar implements PartialCRUDService {
  constructor() {}
}

```

## Testing a hook

To test a hook you can use the `getPreMiddleware` and `getPostMiddeware` utils from `@foal/core`;

## Testing a service with hooks

When testing service methods, hooks are skipped. So with the previous example you have:

```typescript
import { expect } from 'chai';

function test() {
  const myService = new MyService();
  const actual = myService.create({}, { query: {} });
  expect(actual).to.equal('Created');
}

test();
```
