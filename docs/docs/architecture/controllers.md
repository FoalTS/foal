---
title: Controllers
---


```sh
npx foal generate controller my-controller
```

```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';

export class ProductController {

  @Get('/products')
  listProducts(ctx: Context) {
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
import { controller, Get, HttpResponseOK, Post } from '@foal/core';

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
import { controller, IAppController } from '@foal/core';

import { ApiController } from './controllers/api.controller';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController)
  ];
}
```

## Contexts & HTTP Requests

### The `Context` object

On every request, the controller method is called with a `Context` object. This context is unique and specific to the request.

It has seven properties:

| Name | Type | Description |
| --- | --- | --- |
| `request` | `Request` | Gives information about the HTTP request. |
| `state` | `{ [key: string]: any }` | Object which can be used to forward data accross several hooks (see [Hooks](./hooks.md)). |
| `user` | `{ [key: string]: any }`\|`null` | The current user (see [Authentication](../authentication/quick-start.md)). | 
| `session`| `Session`\|`null` | The session object if you use sessions. |
| `files` | `FileList` | A list of file paths or buffers if you uploaded files (see [Upload and download files](../common/file-storage/upload-and-download-files.md)). |
| `controllerName` | `string` | The name of the controller class. |
| `controllerMethodName` | `string` | The name of the controller method. |

The types of the `user` and `state` properties are generic. You override their types if needed:

```typescript
import { Context, Get } from '@foal/core';

interface State {
  foo: string;
}

interface User {
  id: string;
}

export class ProductController {
  @Get('/')
  getProducts(ctx: Context<User, State>) {
    // ...
  }
}
```

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
import { Context, HttpResponseOK, Get } from '@foal/core';

class AppController {
  @Get('/products/:id')
  readProduct(ctx: Context) {
    const productId = ctx.request.params.id;
    // Do something.
    return new HttpResponseOK();
  }
}
```

#### Read Query Parameters

Query parameters are accessible with the `query` attribute.

```
GET /products?limit=3
```

```typescript
import { Context, HttpResponseOK, Get } from '@foal/core';

class AppController {
  @Get('/products')
  readProducts(ctx: Context) {
    const limit = ctx.request.query.limit;
    // Do something.
    return new HttpResponseOK();
  }
}
```

#### Read Headers

Headers are accessible with the `get` method.

```typescript
import { Context, HttpResponseOK, Get } from '@foal/core';

class AppController {
  @Get('/')
  index(ctx: Context) {
    const token = ctx.request.get('Authorization');
    // Do something.
    return new HttpResponseOK();
  }
}
```

#### Read Cookies

Cookies are accessible through the `cookies` attribute.

```typescript
import { Context, HttpResponseOK, Get } from '@foal/core';

class AppController {
  @Get('/')
  index(ctx: Context) {
    const sessionID: string|undefined = ctx.request.cookies.sessionID;
    // Do something.
    return new HttpResponseOK();
  }
}
```

Signed cookies are accessible through the `signedCookies` attribute.

```typescript
import { Context, HttpResponseOK, Get } from '@foal/core';

class AppController {
  @Get('/')
  index(ctx: Context) {
    const cookie1: string|undefined = ctx.request.signedCookies.cookie1;
    // Do something.
    return new HttpResponseOK();
  }
}
```

> In order to use signed cookies, you must provide a secret with the configuration key `settings.cookieParser.secret`.


#### The Controller Method Arguments

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
| 429 | `HttpResponseTooManyRequests` | no |
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

> The `HttpResponseServerError` constructor also accepts two other options: a `Context` object and an error.
>
> *Example*
> ```typescript
> new HttpResponseServerError({}, { error, ctx });
> ```

The type of the `body` may be constrained. This is useful if you wish to guarantee your endpoints return a certain data shape.

*Example with a constrained body type*
```typescript
interface Item {
  title: string
}

// OK
new HttpResponseOK<Item>({ title: 'foobar' })

// Error
new HttpResponseOK<Item>('foobar')
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

### Adding Cookies

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
        httpOnly: true,
        // expires: new Date(2022, 12, 12),
        maxAge: 3600,
        path: '/',
        sameSite: 'lax',
        secure: true,
      });
  }
}
```

> The `maxAge` cookie directive defines the number of **seconds** until the cookie expires.

*Example with a signed cookie.*
```typescript
import { Get, HttpResponseOK } from '@foal/core';

class AppController {
  @Get('/')
  index() {
    return new HttpResponseOK()
      .setCookie('cookie1', 'value1', {
        signed: true
      });
  }
}
```

> In order to use signed cookies, you must provide a secret with the configuration key `settings.cookieParser.secret`.

## Testing Controllers

A controller is a simple class and so can be tested as is. Note that [hooks](./hooks.md) are ignored upon testing.

*api.controller.ts (example)*
```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

class ApiController {
  @Get('/users/me')
  @JWTRequired()
  getCurrentUser(ctx: Context) {
    return new HttpResponseOK(ctx.user);
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
import { Get, HttpResponseOK, Post } from '@foal/core';

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
