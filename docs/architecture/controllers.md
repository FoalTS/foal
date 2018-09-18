# Controllers

```sh
foal generate controller my-controller
```

```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';

export class MyController {

  @Get('/flight')
  getFlights(ctx: Context) {
    return new HttpResponseOK([]);
  }

}
```

## What for?

Controllers are the front door of your application. They catch all the incoming requests and they return the answers to the client. Controllers aim to decode and validate the incoming data but not to treat it. This task is delegated to the services which can be called from the controllers. Thus their code should be concise as they have nothing to do with the business logic.

## How to?

### Creating a controller

Formally a controller is a single class that is instantiated as a singleton. The methods that handle the requests take also a decorator: `Get`, `Post`, `Patch`, `Put` or `Delete`. Each method with one of theses decorators is responsible for one route.

```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';

export class MyController {
  private flights = [
    { id: 1, from: 'SFO', to: 'NYC' }
  ];

  @Get('/flight')
  getFlights(ctx: Context) {
    return new HttpResponseOK(this.flights);
  }

}
```

### Registering the controller

Each controller is attached to the request handler through a module.

```typescript
import { controller, IModule } from '@foal/core';

import { MyController } from './controllers/my-controller';

export class AppModule implements IModule {
  controllers = [
    controller('/', MyController)
  ];
}
```

## Accessing request data, session or current user

Each decorated method of a controller takes a `Context` as parameter. This object has three properties:
- the express `request` which has information on the request as well as the session object and the `csrfToken` method,
- the `user` property which is undefined or not depedending on if a user were authenticated,
- and a `state` object which is a mere object to forward information between [hooks](./hooks.md).

## Calling service methods

To call a service you need to inject it in your controller. Here are the two ways to do it:

```typescript
import { dependency, Get } from '@foal/core';

class MyService {
  run() {
    console.log('hello world');
  }
}

class MyController {
  @dependency
  myService: MyService;

  @Get('/foo')
  foo(ctx) {
    this.myService.run();
  }
}
// OR
class MyController2 {
  @dependency
  services: ServiceManager;

  @Get('/foo')
  foo(ctx) {
    this.services.get(MyService).run();
  }
}
```

## Testing

A controller is a simple class and so can be tested as is. Note that [hooks](./hooks.md) are ignored upon testing.

```typescript
class MyController() {
  @Get('/foo')
  @LoginRequired()
  foo(ctx: Context) {
    return new HttpResponseOK('Ok!'):
  }
}
```

```typescript
import { ok } from 'assert';

const controller = new Controller();
const ctx = new Context({});
ok(controller.foo(ctx) instanceof HttpResponseOK);
```

## Inheriting controllers

```typescript
abstract class ParentController {
  @Get('/foo')
  foo() {
    return new HttpResponseOK();
  }
}


class ChildController extends ParentController {
  @Post('/bar')
  bar() {
    return new HttpResponseOK();
  }
}
```

You can also override `foo`. If you don't add a `Get`, `Post`, `Patch`, `Put` or `Delete` decorator then the parent path and HTTP method are used. If you don't add a hook, then the parent hooks are used. Otherwise they are all discarded.

## Common controllers

FoalTS provides some common controllers to [authenticate](../security/authentication.md) users or to create [REST](../cookbook/rest-api.md) <!--or [GraphQL](../cookbook/graphql.md) -->API.

## Responding with special status or headers

Controller methods should return an `HttpResponse`. Here are the available options.

`abstract class HttpResponseSuccess` (2xx):
- `class HttpResponseOK` (200)
- `class HttpResponseCreated` (201)

`abstract class HttpResponseRedirection` (3xx):
- `class HttpResponseRedirect` (302)

`abstract class HttpResponseClientError` (4xx):
- `class HttpResponseBadRequest` (400)
- `class HttpResponseUnauthorized` (401)
- `class HttpResponseForbidden` (403)
- `class HttpResponseNotFound` (404)
- `class HttpResponseMethodNotAllowed` (405)
- `class HttpResponseConflict` (409)

`abstract class HttpResponseServerError` (5xx):
- `class HttpResponseInternalServerError` (500)
- `class HttpResponseNotImplemented` (501)

The `HttpResponseSuccess`, `HttpResponseClientError` and `HttpResponseServerError` can take an optional argument `content` which is used in the body of the reponse. Ex: `new HttpResponseBadRequest({ message: 'The foo field is missing.' })`
