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

- `HttpResponseBadRequest` (400)
- `HttpResponseUnauthorized` (401)
- `HttpResponseForbidden` (403)
- `HttpResponseNotFound` (404)
- `HttpResponseMethodNotAllowed` (405)
- `HttpResponseConflict` (409)
- `HttpResponseInternalServerError` (500)
- `HttpResponseNotImplemented` (501)

The error may take an optional argument `details: ObjectType` to give more information on the error. This object aims to be returned to the client. Ex: `new HttpResponseBadRequest({ message: 'The foo field is missing.' })`

## `Foal`

## `ServiceManager`