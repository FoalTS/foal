---
title: Error-handling
---

## Customizing the Error Handler

In version 1, we had to provide an option to `createApp` to use `AppController.handleError`. This is no longer necessary.

```typescript
// Before
const app = createApp(AppController, {
  methods: {
    handleError: true
  }
});

// After
const app = await createApp(AppController);
```

## Errors in Hook Post Functions

In version 1, hook post functions were skipped when an error was thrown or rejected. In version 2, this is no longer the case and the response passed to the post functions is an `HttpResponseInternalServerError` instance.

```typescript
class Controller {

  @Get('/products')
  @Hook(() => response => {
    // Not executed in version 1.
    // Executed in version 2 and the response is an `HttpResponseInternalServerError` instance.
    console.log(response);
  })
  readProducts() {
    throw new Error();
  }

}
```

## New features

### The `IAppController` interface

The `AppController` can implement the `IAppController` interface. In this way, we make sure that the optional methods `init` and `handleError` are correctly implemented as well as the `subControllers` property.

### Error details and `HttpResponseInternalServerError`

The default `HttpResponseInternalServerError` instance returned by the error handler when an error is thrown or rejected has two new properties:
the `error` and the `ctx`.
