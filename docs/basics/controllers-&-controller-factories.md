# Controllers

// Add a little get-started (some code or a cli command)
// Controllers are the front-door of your app.
// Explain inheritance (restricted)

Controller factories are functions that create controllers from services or functions. They should be the only way to create them.

What should do controller?
- handle HTTP stuff
- validate input data
- call the appropriate service methods
- convert exceptions (ValidationErrors, etc) to HttpResponse or GraphQL errors.

## Common controller factories

You'll find in [this page](../common/controller-factories) the common controller factories provided by FoalTS.

## Create a custom controller factory

To create a custom controller factory you need to create a function that returns a `Controller<RouteName extends string>`. Usually this function takes as first parameter a path.

Example:
```typescript
export interface IFoobarService {
  compute(x: number);
}

function myCustomControllerFactory(path: string, Foobar: Class<FoobarService>): Controller<'main'> {
  const controller = new Controller<'main'>(path);

  controller.addRoute('POST', '/compute', (ctx, services) => {
    if (!ctx.request.body || typeof ctx.request.body.x !== 'number') {
      return new HttpResponseBadRequest();
    }
    const x = ctx.request.body.x;
    return new HttpResponseOK(services.get(Foobar).compute(x));
  });

  return controller;
}
```

### The `HttpReponse`s

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
