# Controllers

```sh
foal generate controller my-controller
```

```typescript
import { Context, Controller, Get, HttpResponseOk } from '@foal/core';

@Controller()
export class MyController {

  @Get('/flight')
  getFlights(ctx: Context) {
    return new HttpResponseOk([]);
  }

}
```

## What for?

Controllers are the front door of your application. They catch all the incoming requests and it is through them that answers are returned to the client. Controllers aim to decode and validate the incoming data but not to treat it. This task is delegated to the services which can be called from the controllers. Thus their code should be concise as they have nothing to do with the business logic.

## How to?

### Creating a controller

Formally a controller is a single class that is instantiated as a singleton. The class itself is surrounded by the `Controller` decorator. The methods that handle the requests take also a decorator: `Get`, `Post`, `Patch`, `Put` or `Delete`. Each method with one of theses decorators is responsible for one route.

```typescript
import { Context, Controller, Get, HttpResponseOk } from '@foal/core';

@Controller()
export class MyController {
  private flights = [
    { id: 1, from: 'SFO', to: 'NYC' }
  ];

  @Get('/flight')
  getFlights(ctx: Context) {
    return new HttpResponseOk(this.flights);
  }

}
```

In the above example the request handler will respond to the following routes:
- `GET /foo`

Note that we didn't validate the incoming data. A malicious attacker could send whatever "flight" he/she likes and ...

### Registering the controller

```typescript
import { controller, IModule, Module } from '@foal/core';

import { MyController } from './controllers/my-controller';

@Module()
export class AppModule implements IModule {
  controllers = [
    MyController
  ];
}
```

## Accessing request data, session or current user

## Calling service methods

## Testing

## Inheriting controllers

// Explain inheritance (restricted)

## Common controllers

FoalTS provides some common controllers to [log in](../security/authentication.md) users or to create [REST](../cookbook/rest-api.md) or [GraphQL](../cookbook/graphql.md) API.

## Responding with special status or headers

You may return an `HttpResponse` in a pre-hook or in a controller method. This will stop the execution of the pre-hooks and the controller method and the returned value will be assigned to `ctx.response`. It may be read or modified in a post-hook. This response is then used as the request response.

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
