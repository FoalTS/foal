# @foal/authentication

This package is dedicated to authentication and authorization. You'll find a complete example at the end of the page.

## Authentication

Authentication is divided in three parts in FoalTS:
- the `Authenticator` services,
- the `authentication` controller factory,
- and the `authenticate` pre-hook.

> *Note*: FoalTS authentication requires the use of sessions.

### The `Authenticator` interface

```typescript
interface IAuthenticator<User> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
```

A service implementing the `IAuthenticator` interface aims to authenticate a user from its credentials. Usual credentials would be an email and a password but it could be anything you want (such Google, Facebook or Twitter credentials for example). If the credentials are invalid no error should be thrown and the `authenticate` method should return `null`.

- `EmailAuthenticatorService` (email and password)

`EmailAuthenticatorService` is an abstract class that implements the `Authenticator` interface. Its `authenticate` method is asynchronous and takes an `{ email: string, password: string }` object as parameter.

Its constructor takes a user service that must implement the `IModelService` interface and have a `checkPassword(user: User, password: string): boolean` method.

*Example*:
```typescript
import { EmailAuthenticatorService } from '@foal/authentication';
import { Service } from '@foal/core';

import { User } from './user.interface';
import { MyUserService } from './my-user.service.ts';

@Service()
export class MyAuthenticatorService extends EmailAuthenticatorService<User> {

  constructor(userService: MyUserService) {
    super(userService);
  }

}
```


### The `authentication` controller factory

The `authentication` controller factory attaches an `Authenticator` service to the request handler. It accepts optional options `{ failureRedirect?: string, successRedirect?: string }`.

When the authentication succeeds it returns an `HttpResponseOK` with the user if `successRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

When the authentication fails it returns an `HttpResponseUnauthorized` if `failureRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

```typescript
import { Module } from '@foal/core';
import { authentication, validateEmailCredentialsFormat } from '@foal/authentication';

import { MyAuthenticatorService } from './my-authenticator.service';

export const AuthModule: Module = {
  controllers: [
    authentication
      .attachService('/login', MyAuthenticatorService, {
        failureRedirect: '/login?invalid_credentials=true',
        successRedirect: '/home'
      })
      .withPreHook(validateEmailCredentialsFormat())
  ]
}
```

### The `authenticate` pre-hook

The `authenticate` pre-hook is used to authenticate the user for each request. If the user has already logged in (thanks to the `authentication` controller factory), then the `user context` will be defined.

Usually it is registered once within the `AppModule` `preHooks`.

*Example:*
```typescript
import { basic, Module } from '@foal/core';
import { authenticate } from '@foal/authentication';

export const AppModule: Module = {
  controllers: [
    basic
      .attachHandlingFunction('GET', '/foo', ctx => {
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
    authenticate(),
  ]
}
```

### Logging out

To log out the user, you need to use the `attachLogout` function.

```typescript
authentication
  .attachLogout('/logout', { redirect: '/login' });
```

## Authorization

### `restrictAccessToAuthenticated()`

`restrictAccessToAuthenticated` is a pre-hook to restrict the access to authenticated users.

If no user is authenticated the pre-hook returns an `HttpResponseUnauthorized`.

*Example*:
```typescript
import { authenticate, restrictAccessToAuthenticated } from '@foal/authentication';
import { basic, Module } from '@foal/core';

export const AppModule: Module = {
  controllers: [
    basic
      .attachHandlingFunction('POST', '/user', ctx => {
        console.log(ctx.user);
      })
      .withPreHook(restrictAccessToAuthenticated()),
  ],
  preHooks: [
    authenticate()
  ]
}
```

### `restrictAccessToAdmin()`

`restrictAccessToAdmin` is a pre-hook to restrict the access to admin users.

If no user is authenticated the pre-hook returns an `HttpResponseUnauthorized`.

If the user is not an admin, namely it has no property `isAdmin` or this property is false, then the pre-hook returns an `HttpResponseForbidden`.

*Example*:
```typescript
import { authenticate, restrictAccessToAdmin } from '@foal/authentication';
import { basic, Module } from '@foal/core';

export const AppModule: Module = {
  controllers: [
    basic
      .attachHandlingFunction('POST', '/user', ctx => {
        console.log(ctx.user);
      })
      .withPreHook(restrictAccessToAdmin()),
  ],
  preHooks: [
    authenticate()
  ]
}
```

## A complete example

**Warning**: this example does not include the csrf protection.

```
- src
  '- app
    |- auth
    | |- auth.module.ts
    | '- auth.service.ts
    |- shared
    | '- user.service.ts
    | '- user.interface.ts
    '-app.module.ts
```

```typescript
// app.module.ts
import { authenticate, restrictToAuthenticated } from '@foal/authentication';
import { basic, Module } from '@foal/core';

import { AuthModule } from './auth/auth.module';

export const AppModule: Module = {
  controllers: [
    basic
      .attachHandlingFunction('GET', '/foo', ctx => {
        console.log(ctx.user);
      })
      .withPreHook(restrictToAuthenticated())
  ],
  modules: [
    AuthModule
  ],
  preHooks: [
    authenticate()
  ]
}
```

```typescript
// auth.module.ts
import { authentication, validateEmailCredentialsFormat } from '@foal/authentication';
import { basic, HttpResponseOK, Module } from '@foal/core';

import { AuthService } from './auth.service';

export const AuthModule: Module = {
  controllers: [
    authentication
      .attachService('/login', AuthService)
      .withPreHook(validateEmailCredentialsFormat()),
    // In practice we would use below the view controller
    // factory with a template.
    basic
      .attachHandlingFunction('GET', '/login', () => {
        return new HttpResponseOK(`
          <form method="POST" action="/login">
            Email: <input type="email" name="email">
            <br>
            Password: <input type="password" name="password">
            <br>
            <button type="submit">Log in</button>
          </form>
        `);
      })
  ]
}
```

```typescript
// auth.service.ts
import { EmailAuthenticatorService } from '@foal/authentication';
import { Service } from '@foal/core';

import { User } from '../shared/user.interface';
import { UserService } from '../shared/user.service.ts';

@Service()
export class AuthService<User> extends EmailAuthenticatorService {

  constructor(userService: UserService) {
    super(userService);
  }

}
```

```typescript
// user.interface.ts
export interface User {
  email: string;
  password: string;
  name: string;
  isAdmin: boolean;
}
```

```typescript
// user.service.ts
import { CheckPassword } from '@foal/authentication';
import { Service } from '@foal/core';
import * as bcrypt from 'bcrypt-nodejs';
// other imports...

import { User } from './user.interface';

@Service()
export class UserService extends ... implements CheckPassword<User> {
  constructor(...) {
    ...
  }

  public createOne(data: User): ... {
    return super.createOne({
      ...data,
      password: bcrypt.hashSync(data.password)
    });
  }

  public checkPassword(user: User, password: string): boolean {
    return bcrypt.compareSync(password, user.password);
  }

}

```