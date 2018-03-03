# 5. Control and sanitize input data

Of course, input data received by the server cannot be trusted. That's why we need to add control and sanitization tools. These are called pre-hooks.

A pre-hook is a small function, synchronous or asynchronous, that aims to be connected to one, several or all the routes of a controller. It takes two parameters:
- the `Context` object which provides some information on the http request as well as the session object and the authenticated user if they exist,
- the service manager that lets access other services within the hook.

If an `HttpResponse` is returned (or rejected) in the pre-hook then the processing of the request is stopped and the server responds with the `statusCode` and optional `content` of the returned object.

> *Note*: A pre-hook may also be registered within the `preHooks` property of a module. If so it applies to all the controllers of the module.

In our case we would like to check that the input data has the correct shape and to escape its content to prevent [XSS attacks](https://en.wikipedia.org/wiki/Cross-site_scripting).

To check that the request body matches a proper schema, we are going to use the `validate` pre-hook which implements the [Ajv](https://github.com/epoberezkin/ajv) library.

```typescript
import { validate } from '@foal/ajv';

...
const validateTask = validate({
  additionnalProperties: false,
  properties: {
    completed: { type: 'boolean' },
    text: { type: 'string' },
  },
  required: [ 'text' ],
  type: 'object'
});
...
```

To escape the field `text` of the created/updated/replaced task, we are going to write it on our own.

```typescript
import { escapeHTML } from '@foal/common';

const preventXSS = ctx => { escapeHTML(ctx.body, 'text'); };
```

Now that the pre-hooks are defined, it is time to attach them to regarded routes.

```typescript
import { rest } from '@foal/common';
import { FoalModule } from '@foal/core';

import { TaskService } from './task.service';

// Usually the pre-hooks would be defined in a seperate file.

const validateTask = validate({
  additionnalProperties: false,
  properties: {
    completed: { type: 'boolean' },
    text: { type: 'string' },
  },
  required: [ 'text' ],
  type: 'object'
});

const preventXSS = ctx => { escapeHTML(ctx.body, 'text'); };

export const AppModule: FoalModule = {
  controllers: [
    rest
      .attachService('/tasks', TaskService)
      .withPreHook(
        [ validateTask, preventXSS ],
        'postAll', 'patchById', 'putById'
      )
  ],
};
```

Data sent to your server is now controlled and sanitized! If you try to create a task with no `text` field, the server should respond with a 400 status and the details on what went wrong.