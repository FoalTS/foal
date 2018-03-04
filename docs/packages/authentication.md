# @foal/authentication

This package is dedicated to authentication and authorization.

## Authentication

Authentication is divided in three parts in FoalTS:
- the `Authenticator` services,
- the `authentication` controller factory
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

## Authorization