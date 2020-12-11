---
title: Error Handling
---

When creating a new project with Foal, error handling is already configured for you. When an error is thrown or rejected in a controller or a hook, the application returns an html page `Internal Server Error` with the status code `500`. If the configuration key `settings.debug` is set to `true` (which is the case during development or testing), the page includes some details about the error (name, message, stack trace, etc).

In some situations, we may want to override this behavior. This can be the case when we want, for example, to send the error to an external service, treat some errors in a particular way, customize the error page or return a JSON object to describe the error.

To do this, you can pass an additional option to the `createApp` function and add an `handleError` method to the `AppController` class.

*src/index.ts*
```typescript
// ...

export async function main() {
  // ...

  const app = createApp(AppController, {
    methods: {
      handleError: true
    }
  });

  // ...
}
```

*src/app/app.controller.ts (example)*
```typescript
import { Context, HttpResponse, renderError } from '@foal/core';

function sendErrorToAnExternalService(error: Error, user: User) {
  // ...
}

export class AppController {
  subControllers = [
    // ...
  ];

  handleError(error: Error, ctx: Context): HttpResponse|Promise<HttpResponse> {
    sendErrorToAnExternalService(error, ctx.user);

    if (error instanceof MyError) {
      // Do something
    }

    return renderError(err, ctx);
  }
}
```

> If necessary, error logging can be disabled by setting the `settings.logErrors` configuration key to `false`.