# @foal/core

Core package of the framework.

## Classes

### `App`

### `basic` controller factory

### `Controller`

### The `HttpReponse`s

You may return an `HttpResponse` in a pre-hook or in an handler. This will stop the execution of the pre-hooks and the handler and the returned value will be assigned to `ctx.result`. It may be read or modified in a post-hook. This result is then used to generate the request response.

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

### `ServiceControllerFactory<IService, RouteName extends string, Options = undefined>`

### `ServiceManager`

## Interfaces

### `Context`

```typescript
interface Context<User = any> {
  session: any;
  params: ObjectType;
  body: any;
  query: ObjectType;
  state: ObjectType;
  user: User | null;
  getHeader(field: string): string;
}

interface PostContext extends Context {
  result: HttpResponse | undefined;
}
```

### Hooks

```typescript
type PreHook = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void | HttpResponse>;
type Handler = (ctx: Context, services: ServiceManager) => void | HttpResponse | Promise<void | HttpResponse>;
type PostHook = (ctx: PostContext, services: ServiceManager) => void | Promise<void>;
```

### `Module`

```typescript
interface Module {
  controllers?: Controller<string>[];
  modules?: Module[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}
```

## Testing

### `createEmptyContext()`

Creates an empty `Context`. This util is useful when testing a pre-hook.

### `createEmptyPostContext()`

Creates an empty `PostContext`. This util is useful when testing a post-hook.

## Utils

### `conbinePostHooks`

### `conbinePreHooks`
