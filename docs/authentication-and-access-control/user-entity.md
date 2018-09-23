# User Entity and `create-user` Script

## The User Entity

The `User` entity is the core of the authentication and authorization system. It is a class that represents the `user` table in the database and each of its instances represents a row in this table.

The class definition is usually located in the file `src/app/entities/user.entity.ts`. Its attributes represent the columns of the table. It extends the `AbstractUser` which has some useful utilities to handle authentication and authorization.

The primary attributes of the `AbstractUser` are:

| Property name | Type | Database Link |
| --- | --- | --- |
| id | number | Primary auto generated key |
| groups | Group[] | A many-to-many relation with the table group |
| userPermissions | Permission[] | A many-to-many relation with the table permission |

## Creating users ...

There are several ways to create users.

### ... programmatically

```typescript
import { getManager, getRepository } from 'typeorm';

import { User } from 'src/app/entities';

async function main() {
  const user = new User();
  user.foo = 1;
  await getManager().save(user);
  // OR
  await getManager().save(User, {
    foo: 1
  });
  // OR
  await getRepository(User).save({
    foo: 1
  });
}

main();
```

### ... with a Shell Script (CLI)

## Authenticating users

## Email and Password

### Create a user

Go to `src/app/entities/user.entity` and add two new columns: an email and a password.

```typescript
import { AbstractUser, parsePassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
​
@Entity()
export class User extends AbstractUser {
​
  @PrimaryGeneratedColumn()
  id: number;
​
  @Column({ unique: true })
  email: string;
​
  @Column()
  password: string;
​
  async setPassword(password: string) {
    // 'parsePassword' is a Foal built-in function which deals with password encryption. Therefore no password in clear text is saved in the database. 
    this.password = await parsePassword(password);
  }​
}

export { Group, Permission } from '@foal/core';

```

> You can use the `scripts/create-user.ts` to create users. Simply run `npm run build:scripts && foal run-script create-user email=mary@foalts.org password=mary_password`.

### Create an Authenticator

Create a new strategy (an `IAuthenticator`) to authenticate the user from its credentials. In this case, use the built-in `EmailAuthenticator` (it is based on users which use email and password).

```sh
foal g service authenticator
> EmailAuthenticator
```

```typescript
import { EmailAuthenticator } from '@foal/core';

import { User } from '../entities';

export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}

```

You can now call the method `authenticate({ email, password }): Promise<User|null>` from the `Authenticator` service to authenticate a user. If the credentials are incorrect then the `null` value is returned.

### Create a LoginController

```sh
foal g controller auth
> Login
```

Replace the content with:
```typescript
import { emailSchema, Get, LoginController, render, strategy } from '@foal/core';
​​
import { Authenticator } from '../services/authenticator.service';

export class AuthController extends LoginController {
  strategies = [
    strategy('login-with-email', Authenticator, emailSchema),
  ];

  redirect = {
    failure: '/login', // optional
    logout: '/login', // optional
    success: '/home', // optional
  };

  @Get('/login')
  renderLogin(ctx) {
    return render('./templates/login.html', { csrfToken: ctx.request.csrfToken() }, __dirname);
  }
}
```

Create a file named `login.html` inside `controllers/templates` with the following content:
```html
<html>
  <head></head>
  <body>
    <form action="/login-with-email" method="POST">
      <input style="display: none" name="_csrf" value="<%= csrfToken %>">
      <input type="email" name="email">
      <input type="password" name="password">
      <button type="submit">Log in</button>
    </form>
  </body>
</html>
```

## Authenticate the user on further requests

```typescript
@Authenticate(User) // Add user to each context.
export class AppController {
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
import { EmailAuthenticator } from '@foal/core';

import { User } from './user.entity';

export class AuthenticatorService extends EmailAuthenticator<User> {
  entityClass = User;
}
```


When the authentication succeeds it returns an `HttpResponseNoContent` if `successRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

When the authentication fails it returns an `HttpResponseUnauthorized` if `failureRedirect` is undefined or an `HttpResponseRedirect` if it is defined.

### The `Authenticate` hook

The `Authenticate` hook is used to authenticate the user for each request. If the user has already logged in (thanks to the `login` controller factory), then the `user context` will be defined.

Usually it is registered once within the `AppController`.


### Logging out

To log out the user: GET /logout

When the logout succeeds it returns an `HttpResponseNoContent` if `redirect` is undefined or an `HttpResponseRedirect` if it is defined.-->
