---
title: Controllers
---

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

A controller is simply a class of which some methods are responsible for a route. These methods must be decorated by one of theses decorators `Get`, `Post`, `Patch`, `Put`, `Delete`, `Head` or `Options`. They may be asynchronous.

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

### The `Context` object

On every request, the controller method is called with a `Context` object. This context is unique and specific to the request.

It has four properties:
- a `request` (type: `Request`) giving information about the HTTP request received,
- a `state` (type: `object`) which can be used to share data between hooks (see [Hooks](./hooks.md)),
- a `user` (type: `any` or `undefined`) giving information on the current user (see [Authentication](../authentication-and-access-control/quick-start.md)),
- and a `session` (type: `Session` or `undefined`) containing the session data if you use sessions.

### HTTP Requests

The `request` property is an [ExpressJS](http://expressjs.com/) request object. Its complete documentation can be consulted [here](http://expressjs.com/en/4x/api.html#req). The below sections detail common use cases.

#### Read the Body

The request body is accessible with the `body` attribute. Form data and JSON objects are automatically converted to JavaScript objects in FoalTS.

```
POST /products

{
  "name": "milk"
}
```

```typescript
import { Context, HttpResponseCreated, Post } from '@foal/core';

class AppController {
  @Post('/products')
  createProduct(ctx: Context) {
    const body = ctx.request.body;
    // Do something.
    return new HttpResponseCreated();
  }
}
```

#### Read Path Parameters

Path parameters are accessible with the `params` attribute.

```
GET /products/3
```

```typescript
import { Context, HttpResponseOK, Post } from '@foal/core';

class AppController {
  @Get('/products/:id')
  readProduct(ctx: Context) {
    const productId = ctx.request.params.id;
    // Do something.
    return new HttpResponseOK(/* something */);
  }
}
```

#### Read Query Parameters

Query parameters are accessible with the `query` attribute.

```
GET /products?limit=3
```

```typescript
import { Context, HttpResponseOK, Post } from '@foal/core';

class AppController {
  @Get('/products')
  readProducts(ctx: Context) {
    const limit = ctx.request.query.limit;
    // Do something.
    return new HttpResponseOK(/* something */);
  }
}
```

#### Read Headers

Headers are accessible with the `get` method.

```typescript
import { Context, Get } from '@foal/core';

class AppController {
  @Get('/')
  index(ctx: Context) {
    const token: string|undefined = ctx.request.get('Authorization');
    // ...
  }
}
```

#### Read Cookies

Cookies are accessible with the `cookies` attribute.

```typescript
import { Context, Get } from '@foal/core';

class AppController {
  @Get('/')
  index(ctx: Context) {
    const sessionID: string|undefined = ctx.request.cookies.sessionID;
    // ...
  }
}
```


#### The Controller Method Arguments

> Available in Foal v1.9.0 onwards.

The path paramaters and request body are also passed as second and third arguments to the controller method.

```typescript
import { Context, HttpResponseCreated, Put } from '@foal/core';

class AppController {
  @Put('/products/:id')
  updateProduct(ctx: Context, { id }, body) {
    // Do something.
    return new HttpResponseCreated();
  }
}
```

## HTTP Responses

HTTP responses are defined using `HttpResponse` objects. Each controller method must return an instance of this class (or a *promise* of this instance).

Here are subclasses that you can use:
| HTTP method | Response class | Is abstract? |
|---|---|---|
|  | **2XX Success** | |
| 2XX | `HttpResponseSuccess` | yes |
| 200 | `HttpResponseOK` | no |
| 201 | `HttpResponseCreated` | no |
|  | **3XX Redirection** | |
| 3XX | `HttpResponseRedirection` | yes |
| 301 | `HttpResponseMovedPermanently` | no |
| 302 | `HttpResponseRedirect` | no |
|  | **4XX Client errors** | |
| 4XX | `HttpResponseClientError` | yes |
| 400 | `HttpResponseBadRequest` | no |
| 401 | `HttpResponseUnauthorized` | no |
| 403 | `HttpResponseForbidden` | no |
| 404 | `HttpResponseNotFound` | no |
| 405 | `HttpResponseMethodNotAllowed` | no |
| 409 | `HttpResponseConflict` | no |
|  | **5XX Server errors** | |
| 5XX | `HttpResponseServerError` | yes |
| 500 | `HttpResponseInternalServerError` | no |
| 501 | `HttpResponseNotImplemented` | no |

Most of these responses accept a `body` at instantiation. It can be a `Buffer` object, a string, an object, a number, an array, or even a Node.JS stream.

*Example with a body*
```typescript
new HttpResponseBadRequest({
  message: 'The foo field is missing.'
})
```

In case the body parameter is a stream, you must specify it using the `stream` option.

*Example with a Node.JS stream as body*
```typescript
new HttpResponseOK(myStream, { stream: true })
```

### Adding Headers

*Example*
```typescript
import { Get, HttpResponseOK } from '@foal/core';

class AppController {
  @Get('/')
  index() {
    return new HttpResponseOK()
      .setHeader('Cache-Control', 'max-age=604800, public');
  }
}
```

### Adding cookies

*Example with no cookie directives*
```typescript
import { Get, HttpResponseOK } from '@foal/core';

class AppController {
  @Get('/')
  index() {
    return new HttpResponseOK()
      .setCookie('state', 'foobar');
  }
}
```

*Example with cookie directives*
```typescript
import { Get, HttpResponseOK } from '@foal/core';

class AppController {
  @Get('/')
  index() {
    return new HttpResponseOK()
      .setCookie('sessionID', 'xxxx', {
        domain: 'example.com',
        // expires: new Date(2020, 12, 12),
        httpOnly: true,
        maxAge: 3600,
        path: '/',
        secure: true,
        sameSite: 'lax',
      });
  }
}
```

> The `maxAge` cookie directive defines the number of **seconds** until the cookie expires.

## Testing Controllers

A controller is a simple class and so can be tested as is. Note that [hooks](./hooks.md) are ignored upon testing.

*api.controller.ts (example)*
```typescript
class ApiController {
  @Get('/users/me')
  @JWTRequired()
  getCurrentUser(ctx: Context) {
    return new HttpResponseOK(ctx.user):
  }
}
```

*api.controller.spec.ts (example)*
```typescript
import { strictEqual } from 'assert';

import { Context, createController, HttpResponseOK, isHttpResponseOK } from '@foal/core';

import { ApiController } from './api.controller';

describe('ApiController', () => {

  it('should return the current user.', () => {
    // Instantiate the controller.
    const controller = createController(ApiController);

    // Create a fake user (the current user)
    const user = { name: 'Alix' };

    // Create a fake Context object to simulate the request.
    const ctx = new Context({}); // "{}" is the request body.
    ctx.user = user;

    // Execute the controller method and save the response.
    const response = controller.getCurrentUser(ctx);

    if (!isHttpResponseOK(response)) {
      throw new Error('The response should be an HttpResponseOK');
    }

    strictEqual(response.body, user);
  });

});
```

> Due to the way packages are managed by npm, you should always use `isHttpResponseOK(response)` rather than `response instanceof HttpResponseOK` to avoid reference bugs.

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
