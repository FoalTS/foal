---
title: Gestion des Erreurs
---


When creating a new project with Foal, error handling is already configured for you. When an error is thrown or rejected in a controller or a hook, the application returns an HTML page `Internal Server Error` with the status code `500`. If the configuration parameter `settings.debug` is set to `true` (which is the case during development or testing), the page includes some details about the error (name, message, stack trace, etc).

## Customizing the Error Handler

In some situations, we may want to override this behavior. This can be the case when we want, for example, to send the error to an external service, treat some errors in a particular way, customize the error page or return a JSON object to describe the error.

To do this, you can add an `handleError` method to the `AppController` class.

### Reporting Errors

*app.controller.ts*
```typescript
import { Context, Get, HttpResponse, IAppController, renderError } from '@foal/core';

export class AppController implements IAppController {
  @Get('/')
  index() {
    throw new Error('Hello world');
  }

  handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
    sendErrorToAnExternalService(error);

    return renderError(error, ctx);
  }
}
```

> If necessary, error logging can also be disabled by setting the `settings.logErrors` configuration value to `false`.

### Returning JSON

*app.controller.ts*
```typescript
import { Context, Get, HttpResponse, HttpResponseInternalServerError, IAppController } from '@foal/core';

export class AppController implements IAppController {
  @Get('/')
  index() {
    throw new Error('Hello world');
  }

  handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
    return new HttpResponseInternalServerError({
      err: error.message,
      message: 'An error occured.',
      path: ctx.request.path,
    });
  }
}
```

### Converting Errors into 4xx Responses

*app.controller.ts*
```typescript
import { Context, Get, HttpResponse, HttpResponseForbidden, IAppController, renderError } from '@foal/core';

class PermissionDenied extends Error {}

export class AppController implements IAppController {
  @Get('/')
  index() {
    throw new PermissionDenied();
  }

  handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
    if (error instanceof PermissionDenied) {
      return new HttpResponseForbidden();
    }

    return renderError(error, ctx);
  }
}
```

## Errors in Hooks Post Functions

When an error is thrown or rejected in a hook or in a controller method, it is converted directly into an `HttpResponseInternalServerError` (or another response if the `handleError` above is defined). The method or hook behaves exactly the same as if it had returned this response.

Thus, when using *hook post functions*, you might want to check whether or not an error has been thrown before executing logic.

```typescript
@Hook(() => response => {
  if (isHttpResponseInternalServerError(response)) {
    return;
  }

  // Else execute some logic.
})
```

> If you use the default error handler, then the generated `HttpResponseInternalServerError` has two additional properties: `error` and `ctx`.