# @foal/authentication

This package is dedicated to authentication and authorization.

## Authentication

Authentication is divided in three parts in FoalTS:
- the `Authenticator` services,
- the `authentication` controller factory,
- and the `authenticate` pre-hook.

### The `Authenticator` interface

- `LocalAuthenticatorService` (email and password)

### The `authentication` controller factory

### The `authenticate` pre-hook

```typescript
import { Module } from '@foal/core';
import { authenticate } from '@foal/authentication';

export const AppModule: Module = {
  preHooks: [
    authenticate(),
    ctx => { console.log(ctx.user); }
  ]
}

```

### Logging out

```typescript
basic
  .attachHandlingFunction('POST', '/logout', ctx => {
    delete ctx.session.authentication;
    return new HttpResponseRedirect('/login');
  })
```

## Authorization


### `restrictAccessToAuthenticated()`

Returns a 401 status if the user is not authenticated.

### `restrictAccessToAdmin()`

Returns a 401 status if the user is not authenticated and a 403 if `ctx.user.isAdmin` is not truthy.
