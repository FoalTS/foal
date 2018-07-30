# Authentication


## How to log in a user

### Create a user

Go to `src/app/entities/user.entity` and add two new columns: an email and a password.

```typescript
import { Column, Entity, parsePassword, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Flight {

  @PrimaryGeneratedColumn()
  // @ts-ignore : Property 'id' has no initializer and is not definitely assigned in theconstructor.
  id: number;

  @Column({ unique: true })
  // @ts-ignore : Property 'email' has no initializer and is not definitely assigned in theconstructor.
  email: string;

  @Column()
  // @ts-ignore : Property 'email' has no initializer and is not definitely assigned in theconstructor.
  password: string;

  setPassword(password: string) {
    const o = { password };
    parsePassword(o);
    this.password = o.password;
  }

}
```

### Create an Authenticator

Create a new strategy (an `IAuthenticator`) to authenticate the user from its credentials. In this case, use the built-in `EmailAuthenticator` (it is based on users which use email and password).

```sh
foal g service authenticator
> EmailAuthenticator
```

```typescript
import { EmailAuthenticator, Service } from '@foal/core';

import { User } from '../entities';

@Service()
export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}

```

You can now call the method `authenticate({ email, password }): Promise<User|null>` from the `Authenticator` service to authenticate a user. If the credentials are incorrect then the `null` value is returned.

### Create a LoginController

```sh
foal g controller auth
> Empty
```

Replace the content with:
```typescript
import { Controller, emailSchema, Get, LoginController, render, strategy } from '@foal/core';

import { Authenticator } from '../services/authenticator.service';

const login = require('./templates/login.html');

@Controller()
export class AuthController extends LoginController {
  strategies = [
    strategy('/login', Authenticator, emailSchema),
  ];

  redirect = {
    logout: '/login', // optional
    success: '/home', // optional
    failure: '/login', // optional
  };

  @Get('/login')
  renderLogin(ctx) {
    return render(login, { csrfToken: ctx.request.csrfToken() });
  }
}
```

```html
<html>
  <head></head>
  <body>
    <form action="/login" method="POST">
      <input style="display: none" value="<%= csrfToken %>">
      <input type="email" name="email">
      <input type="password" name="password">
      <button type="submit">Log in</button>
    </form>
  </body>
</html>
```

## Authenticate the user on further requests

```typescript
@Module()
@Authenticate(User) // Add user to each context.
export class AppModule implements IModule {
  ...
}
```
<!--
// TODO: Deal with this.
### The `Authenticator` interface

```typescript
interface IAuthenticator<User> {
  authenticate(credentials: any): User | null | Promise<User|null>;
}
```

A service implementing the `IAuthenticator` interface aims to authenticate a user from its credentials. Usual credentials would be an email and a password but it could be anything you want (such Google, Facebook or Twitter credentials for example). If the credentials are invalid no error should be thrown and the `authenticate` method should return `null`.

- `EmailAuthenticator`

`EmailAuthenticator` is an abstract class that implements the `Authenticator` interface. Its `authenticate` method is asynchronous and takes an `{ email: string, password: string }` object as parameter.

Its constructor takes an user entity.

*Example*:
```typescript
import { EmailAuthenticator, Service } from '@foal/core';

import { User } from './user.entity';

@Service()
export class AuthenticatorService extends EmailAuthenticator<User> {
  entityClass = User;
}
```


When the authentication succeeds it returns an `HttpResponseNoContent` if `successRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

When the authentication fails it returns an `HttpResponseUnauthorized` if `failureRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

### The `Authenticate` hook

The `Authenticate` hook is used to authenticate the user for each request. If the user has already logged in (thanks to the `login` controller factory), then the `user context` will be defined.

Usually it is registered once within the `AppModule.


### Logging out

To log out the user: GET /logout

When the logout succeeds it returns an `HttpResponseNoContent` if `redirect` is undefined or an `HttpResponseRedirect` if it is defined.-->
