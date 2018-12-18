# Controllers

```sh
foal generate controller my-controller
```

```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';

export class MyController {

  @Get('/flights')
  listFlights(ctx: Context) {
    return new HttpResponseOK([]);
  }

}
```

## Description

Controllers are the front door of your application. They intercept all incoming requests and return the responses to the client.

The code of a controller should be concise. If necessary, controllers can delegate some tasks to services (usually the business logic).

## Controller Architecture

A controller is simply a class of which some methods are responsible for a route. These methods must be decorated by one of theses decorators `Get`, `Post`, `Patch`, `Put`, `Delete`, `Head` or `Options`.

*Example:*
```typescript
import { Get, HttpResponseOK, Post } from '@foal/core';

class MyController {
  @Get('/foo')
  foo() {
    return new HttpResponseOK('I\'m listening to GET /foo requests.');
  }

  @Post('/bar')
  bar() {
    return new HttpResponseOK('I\'m listening to POST /bar requests.');
  }
}
```

Controllers may have sub-controllers declared in the `subControllers` property.

*Example:*
```typescript
import { Get, HttpResponseOK, Post } from '@foal/core';

class MySubController {
  @Get('/foo')
  foo() {
    return new HttpResponseOK('I\'m listening to GET /barfoo/foo requests.');
  }
}

class MyController {
  subControllers = [
    controller('/barfoo', MySubController)
  ]

  @Post('/bar')
  bar() {
    return new HttpResponseOK('I\'m listening to POST /bar requests.');
  }
}
```

## The `AppController`

The `AppController` is the main controller of your application. It is directly bound to the request handler. Every controller must be, directly or indirectly, a sub-controller of the `AppController`.

*Example:*
```typescript
import { controller } from '@foal/core';

import { ApiController } from './controllers/api.controller';

export class AppController {
  subControllers = [
    controller('/api', ApiController)
  ];
}
```

## Contexts & HTTP Requests

On every request, the controller method is called with a `Context` object. This context is unique and specific to the request.

It has three properties:
- the express [request object](http://expressjs.com/en/4x/api.html#req) which gives information on the request. It includes a session object and the `csrfToken` method that generates and returns the [CSRF Token](https://en.wikipedia.org/wiki/Cross-site_request_forgery),
- the `user` property which is undefined or not depedending on if a user was authenticated,
- and a `state` object which is a mere object to forward information between [hooks](./hooks.md).


*Example*:
```typescript
import { Context, Post } from '@foal/core';

class AppController {
  private products = [];

  @Post('/products')
  addProduct(ctx: Context) {
    this.products.push(ctx.request.body);
  }
}
```

You can specify a *type argument* to the  `Context` class for more commodity.

*Example:*
```typescript
import { Context, HttpResponseOK, LoginRequired, Post } from '@foal/core';

interface User {
  firstName: string;
  lastName: string;
}

class AppController {
  @Get('/users/me')
  @LoginRequired(/* ... */)
  getFullUserName(ctx: Context<User>) {
    const firstName = ctx.user.firstName;
    const lastName = ctx.user.lastName;
    return new HttpResponseOK(
      firstName + ' ' + lastName
    );
  }
}
```

## HTTP Responses

Controllers return their HTTP responses through `HttpResponse` objects.

Here are the available options:

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

The `HttpResponseSuccess`, `HttpResponseClientError` and `HttpResponseServerError` constructors can take an optional argument `body` which is used as the body of the reponse.

Ex: `new HttpResponseBadRequest({ message: 'The foo field is missing.' })`

The `HttpResponse` class has also 7 methods to set/get cookies and headers:
```typescript
({
  setHeader(name: string, value: string);

  getHeader(name: string): string|undefined;

  getHeaders(): { [key: string]: string };

  setCookie(name: string, value: string, options: CookieOptions = {}): void;

  getCookie(name: string): { value: string|undefined, options: CookieOptions };

  getCookies(): { [key: string]: { value: string|undefined, options: CookieOptions } };
})
```

Eventually, to check if an object is an instance of `HttpResponse` you can use the `isHttpResponse(obj): boolean` utility. An analog function exists for each sub-class of `HttpResponse` (`isHttpResponseNotFound`, etc).

## Testing Controllers

A controller is a simple class and so can be tested as is. Note that [hooks](./hooks.md) are ignored upon testing.

```typescript
class MyController {
  @Get('/foo')
  @LoginRequired()
  foo(ctx: Context) {
    return new HttpResponseOK('Ok!'):
  }
}
```

```typescript
import { ok } from 'assert';

import { Context, createController, HttpResponseOK } from '@foal/core';

const controller = createController(MyController);
const ctx = new Context({});
ok(controller.foo(ctx) instanceof HttpResponseOK);
```

## Inheriting Controllers

*Example:*
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

You can also override `foo`. If you don't add a `Get`, `Post`, `Patch`, `Put`, `Delete`, `Head` or `Options` decorator then the parent path and HTTP method are used. If you don't add a hook, then the parent hooks are used. Otherwise they are all discarded.
