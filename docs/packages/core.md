# @foal/core

Core package of the framework.

## `ControllerFactory<T>`

## `postHook`

## `preHook`

## Contexts

## `FoalModule`

## `ObjectType`

## `combineHooks`

## Testing

### `getPreMiddleware` and `getPostMiddleware`

### `createEmptyContext()`

Creates an empty `Context`. This util is useful when testing a hook.

## Errors

You may throw an `HttpError` in a hook or in an service. This will stop the request and return a client (4xx) or server (5xx) errors to the client.

- `BadRequestError` (400)
- `UnauthorizedError` (401)
- `ForbiddenError` (403)
- `NotFoundError` (404)
- `MethodNotAllowedError` (405)
- `ConflictError` (409)
- `InternalServerError` (500)
- `NotImplementedError` (501)

## `Foal`

## `ServiceManager`