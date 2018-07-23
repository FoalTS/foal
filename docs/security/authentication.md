# Authentication and authorization
// Add a little get-started (some code or a cli command)
## Authentication

Authentication is divided in four parts in FoalTS:
- the `Authenticator` services (strategies),
- the `login` and `logout` controller factories,
- the `User` model,
- and the `authenticate` pre-hook.

> *Note*: FoalTS authentication requires the use of sessions.

### The `Authenticator` interface

```typescript
interface IAuthenticator<User> {
  validate(credentials: any): any;
  authenticate(credentials: any): User | null | Promise<User|null>;
}
```

A service implementing the `IAuthenticator` interface aims to authenticate a user from its credentials. Usual credentials would be an email and a password but it could be anything you want (such Google, Facebook or Twitter credentials for example). If the credentials are invalid no error should be thrown and the `authenticate` method should return `null`. The `validate` method is used to check the format of the credentials received by the server.

- `EmailAuthenticator`

`EmailAuthenticator` is an abstract class that implements the `Authenticator` interface. Its `authenticate` method is asynchronous and takes an `{ email: string, password: string }` object as parameter.

Its constructor takes an user model.

*Example*:
```typescript
import { EmailAuthenticator, Service } from '@foal/core';

import { User } from './user.model.ts';

@Service()
export class AuthenticatorService extends EmailAuthenticator<User> {
  UserModel = User;
}
```

### The `login` controller factory

The `login` controller factory attaches an `Authenticator` service to the request handler. It accepts optional options `{ failureRedirect?: string, successRedirect?: string }`.

When the authentication succeeds it returns an `HttpResponseNoContent` if `successRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

When the authentication fails it returns an `HttpResponseUnauthorized` if `failureRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

```typescript
import { login, Module } from '@foal/core';

import { AuthenticatorService } from './authenticator.service';

export const AuthModule: Module = {
  controllers: [
    login('/login', AuthenticatorService, {
      failureRedirect: '/login?invalid_credentials=true',
      successRedirect: '/home'
    })
  ]
}
```

### The `authenticate` pre-hook

The `authenticate` pre-hook is used to authenticate the user for each request. If the user has already logged in (thanks to the `login` controller factory), then the `user context` will be defined.

Usually it is registered once within the `AppModule` `preHooks`.

*Example:*
```typescript
import { authenticate, route, Module } from '@foal/core';

import { User } from './models/user';

export const AppModule: Module = {
  controllers: [
    route('GET', '/foo', ctx => {
        console.log('In handler: ', ctx.user);
      })
      .withPreHook(ctx => {
        console.log('In pre-hook: ', ctx.user);
      })
      .withPostHook(ctx => {
        console.log('In post-hook: ', ctx.user);
      })
  ]
  preHooks: [
    authenticate(User),
  ],
  models: [
    User
  ]
}
```

### Logging out

To log out the user, you need to use the `logout` function.

```typescript
logout('/logout', { redirect: '/login' });
```

When the logout succeeds it returns an `HttpResponseNoContent` if `redirect` is undefined or an `HttpResponseRedirect` if it is defined.

## Authorization

### `LoginRequired()`

`LoginRequired` is a pre-hook to restrict the access to authenticated users.

If no user is authenticated the pre-hook returns an `HttpResponseUnauthorized`.

*Example*:
```typescript
import { authenticate, LoginRequired , route, Module } from '@foal/core';

import { User } from './models/user';

export const AppModule: Module = {
  controllers: [
    route('POST', '/user', ctx => {
        console.log(ctx.user);
      })
      .withPreHook(LoginRequired()),
  ],
  preHooks: [
    authenticate(User),
  ],
  models: [
    User
  ]
}
```

### `PermissionRequired(perm: string)`

`PermissionRequired` is a pre-hook to restrict the access to users with a given permission.

If no user is authenticated the pre-hook returns an `HttpResponseUnauthorized`.

If the user does not have the required permission then the pre-hook returns an `HttpResponseForbidden`.

*Example*:
```typescript
import { authenticate, PermissionRequired, route, Module } from '@foal/core';

import { User } from './models/user';

export const AppModule: Module = {
  controllers: [
    route('POST', '/user', ctx => {
        console.log(ctx.user);
      })
      .withPreHook(PermissionRequired('my-perm')),
  ],
  preHooks: [
    authenticate(User),
  ],
  models: [
    User
  ]
}
```

## A complete example

```
- src
  '- app
    |- modules
    | '- auth
    |   |- auth.module.ts
    |   |- services
    |   | '- auth.service.ts
    |   '- templates
    |     '- login.html
    |- models
    | '- user.model.ts
    '-app.module.ts
```

```typescript
// app.module.ts
import { authenticate, restrictToAuthenticated, route, Module } from '@foal/core';

import { AuthModule } from './module/auth/auth.module';
import { User } from './models/user.model';

export const AppModule: Module = {
  controllers: [
    route('GET', '/foo', ctx => {
        console.log(ctx.user);
      })
      .withPreHook(restrictToAuthenticated())
  ],
  modules: [
    AuthModule
  ],
  preHooks: [
    authenticate(User)
  ],
  models: [
    User
  ]
}
```

```typescript
// user.model.ts
import { AbstractUser } from '@foal/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

}
```

```typescript
// auth.module.ts
import { controller, Get, Controller, render, Login, Module } from '@foal/core';

import { AuthService } from './services/auth.service';

@Controller()
class LoginViewController {
  @Get()
  index(ctx) {
    return render(require('./templates/login.html'), { csrfToken: ctx.state.csrfToken });
  }
}

export const AuthModule: Module = {
  controllers: [
    login('/login', AuthService),
    controller('/login', LoginViewController)
  ]
}
```

```typescript
// auth.service.ts
import { EmailAuthenticator, Service } from '@foal/core';

import { User } from '../../../models/user.model.ts';

@Service()
export class AuthenticatorService extends EmailAuthenticator<User> {
  UserModel = User;
}
```

```html
<html>
  <head>
    <title>Login</title>
  </head>
  <form action="login" method="POST">
    <input type="text" value="<%= csrfToken %>" style="display: none">
    <input type="text" name="email">
    <input type="password" name="password">
    <button type="submit">Log in</button>
  </form>
</html>
```

====
## Create an authenticating controller from a Authenticator service

```typescript
import { login, Module } from '@foal/core';

import { MyAuthenticatorService } from './services/my-authenticator.service';

export const AppModule: Module = {
  controllers: [
    login('/auth', MyAuthenticatorService, {
      failureRedirect: '/auth?invalide_credentials=true', // Optional
      successRedirect: '/home' // Optional
    })
  ]
};
```