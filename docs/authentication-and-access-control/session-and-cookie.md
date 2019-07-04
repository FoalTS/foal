# Authentication with Sessions and Cookies

FoalTS provides support for authentication with sessions and cookies. This applies whether you're building an MVC application or an API.

## The `LoginOptional` and `LoginRequired` Hooks

The `LoginOptional` and `LoginRequired` hooks authenticate users accross several requests.

If the user has already logged in in a previous request, then it will be available in the `context` with which the controller methods are called.

```ts
import { Get, LoginRequired } from '@foal/core';
import { fetchUser } from '@foal/typeorm';

import { User } from '../entities';

@LoginRequired({ user: fetchUser(User) })
export class AppController {
  @Get('/foo')
  foo(ctx: Context) {
    // ctx.user is defined.
  }
}
```

If no user has previously logged in, the `LoginRequired` hook:
- returns a `401 Unauthorized` if `options.redirect` is undefined,
- or redirects the page to the given path if `options.redirect` is defined.

The `user` option expects a function that takes an id as parameter (number or string) and returns a user object. It is usually a function that fetches some data from the database.

If your `User` class is a TypeORM entity, you can use the `fetchUser` function from the `@foal/typeorm` package. It automatically fetches the user from the database based on the given id.

## How to Log a User In or Out

If you want to attach an authenticated user to the current session, proceed as follows:

```typescript
logIn(ctx, user); // The logIn utility is in the @foal/core package.
```

To log out a user, use the `logOut` utility:
```typescript
logOut(ctx);
```

## Example 1 (API approach)

*user.entity.ts*
```typescript
@Entity()
export class User {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

*auth.controller.ts*
```typescript
export class AuthController {
  @Post('/logout')
  logout(ctx: Context) {
    logOut(ctx);
    return new HttpResponseNoContent();
  }

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async login(ctx: Context) {
    const user = await getRepository(User)
      .findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    logIn(ctx, user);

    return new HttpResponseNoContent();
    // You can also return the user object in this request.
    // return new HttpResponseOK(user);
  }
}
```

*product.controller.ts*
```typescript
@LoginRequired({ user: fetchUser(User) })
export class ProductController {
  @Get('/products')
  async readProducts(ctx: Context) {
    const products = await getRepository(Product)
      .find({ userId: ctx.user.id });
    return new HttpResponseOK(products);
  }
}
```

*app.controller.ts*
```typescript
export class AppController {
  subControllers = [
    AuthController,
    ProductController
  ];
}
```

## Example 2 (MVC approach)

*user.entity.ts*
```typescript
@Entity()
export class User {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
```

*auth.controller.ts*
```typescript
export class AuthController {
  @Post('/logout')
  logout(ctx: Context) {
    logOut(ctx);
    return new HttpResponseRedirect('/login');
  }

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async login(ctx: Context) {
    const user = await getRepository(User)
      .findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseRedirect('/login');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseRedirect('/login');
    }

    logIn(ctx, user);

    return new HttpResponseRedirect('/products');
  }

  @Get('/login')
  renderLogin(ctx: Context) {
    return render('./templates/login.html', { csrfToken: ctx.request.csrfToken() }, __dirname);
  }
}
```

*product.controller.ts*
```typescript
@LoginRequired({ user: fetchUser(User), redirect: '/login' })
export class ProductController {
  @Get('/products')
  async readProducts(ctx: Context) {
    const products = await getRepository(Product)
      .find({ userId: ctx.user.id });
    return new HttpResponseOK(
      '<ul>'
      + products.map(product => `<li>${product.name}</li>`)
      + '</ul>'
    );
  }
}
```

*app.controller.ts*
```typescript
export class AppController {
  subControllers = [
    AuthController,
    ProductController
  ];
}
```

*controllers/templates/login.html*
```html
<html>
  <head></head>
  <body>
    <form action="/login" method="POST">
      <input style="display: none" name="_csrf" value="<%= csrfToken %>">
      <input type="email" name="email">
      <input type="password" name="password">
      <button type="submit">Log in</button>
    </form>
  </body>
</html>
```