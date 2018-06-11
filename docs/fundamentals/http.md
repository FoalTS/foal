# HTTP

### The `HttpReponse`s

You may return an `HttpResponse` in a pre-hook or in an handler. This will stop the execution of the pre-hooks and the handler and the returned value will be assigned to `ctx.response`. It may be read or modified in a post-hook. This response is then used as the request response.

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

### `Context`

```typescript
class Context { ... }

class PostContext extends Context {
  response: HttpResponse | undefined;
}
```

```typescript
type Handler = (ctx: Context, services: ServiceManager) => HttpResponse | Promise<HttpResponse>;
```
