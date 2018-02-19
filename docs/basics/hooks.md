# Hooks

Hooks are an elegant way to deal with access control, input validation or sanitization.

They are TypeScript decorators used on either a service method, a service class or in the `hooks` attribute of a module. They're only executed when the regarded service is used by a controller. So if the method is called from an http request, the controller decorators will be executed. If it is called from the service itself or another one, they'll be skipped.

They are two types of hooks: `pre-hooks` which are executed before the service method (ex: access control, data parser) and `post-hooks` which are executed after (ex: remove some attributes before returning an object to the client). By convention, post-hooks should start with `afterThat`.

## How to create one

To create a hook two things are required:
- a sync or async function called `middleware` which takes two parameters `ctx: Context` and `services: ServiceManager`,
- and either the `preHook` or `postHook` functions.

The context `ctx` contains the following properties:

```typescript
interface Context {
  session: any;
  params: ObjectType;
  body: any;
  query: ObjectType;
  result: any;
  state: ObjectType;
  user: ant|undefined;
  getHeader(field: string): string;
}
```

The `services` have a `get(ServiceClass: Type<T>): T` method which retreives any desired service.

Note that the `middleware` may take an async function (or a function which returns a promise) which lets you easily deal with async programming.

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
import { ModelService } from '@foal/common';
import { Context, ObjectType, preHook, Service } from '@foal/core';

function contextLogger(context: Context): Promise<any> {
  console.log(context);
}

interface User {
  name: string;
}

@Service()
class MyController extends Partial<ModelService<User>> {
  private id = 0;

  constructor() {}

  @preHook(contextLogger)
  public create(data: User): User & { id: string } {
    this.id++;
    return { ...data, id: this.id };
  }
}
```

## Combination

You can combine several hooks into one thanks to `combineHooks`.

```typescript
import { ModelService } from '@foal/common';
import { combineHooks, Service } from '@foal/core';

function myCombinedPreHooks() {
  return combineHooks([
    myPreHook1()
    myPreHook2()
  ])
}

@Service()
@myCombinedPreHooks()
export class Foobar implements Partial<ModelService<any>> {
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
