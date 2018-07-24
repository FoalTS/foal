# 5. Control and sanitize input data

Since input data received by the server cannot be trusted, we need to add control and sanitization tools. These are called hooks.

A hook is a small function, synchronous or asynchronous, that aims to be connected to one, several or all the routes of a controller. It takes two parameters:
- the `Context` object which provides some information on the http request as well as the session object and the authenticated user if they exist,
- the service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or rejected) in the hook then the processing of the request is stopped and the server responds with the `statusCode` and optional `content` of the returned object.

> *Note*: A hook may also decorate a module. If so it applies to all the controllers of the module.

In our case we would like to check that the input data has the correct shape and to escape its content to prevent [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).

To check that the request body matches a proper schema, we are going to use the `ValidateBody` hook which implements the [Ajv](https://github.com/epoberezkin/ajv) library.

```typescript
import { ValidateBody } from '@foal/core';

...
const validateTask = ValidateBody({
  additionnalProperties: false,
  properties: {
    destination: { type: 'string' },
  },
  required: [ 'destination' ],
  type: 'object'
});
...
```

To escape the field `destination` of the created/updated/replaced flight, we are going to write it on our own.

```typescript
import { escapeProp } from '@foal/rest';

const preventXSS = ctx => { escapeProp(ctx.request.body, 'destination'); };
```

Now that the hooks are defined, it is time to attach them to the regarded routes.

```typescript
import { Module, rest } from '@foal/core';

import { getAirport } from './handlers/get-airport';
import { FlightService } from './services/flight.service';

// Usually the hooks would be defined in a separate file in the hooks folder.

const ValidateTask = ValidateBody({
  additionnalProperties: false,
  properties: {
    destination: { type: 'string' },
  },
  required: [ 'destination' ],
  type: 'object'
});

const preventXSS = ctx => { escapeProp(ctx.request.body, 'destination'); };

export const AppModule: Module = {
  controllers: [
    route('GET', '/airport', getAirport),
    rest('/flights', FlightService)
      .withPreHook(
        [ ValidateTask, preventXSS ],
        'POST /', 'PATCH /:id', 'PUT /:id'
      )
  ],
};
```

Data sent to your server is now controlled and sanitized! If you try to create a flight with no `destination` field, the server should respond with a 400 status and the details on what went wrong.