# Auth Controllers and Hooks

So far, you have defined the `User` model and written a script to create new users with their password and email address. The next step is to create a controller to log users in or out.

Here is the architecture that we want:

1. Users open the page `/signin`, enter their credentials and then are redirected to the page `/` if the credentials are correct. If they are not, the page is refreshed with an error message.
1. Users can view, create and delete their todos in the page `/`.
1. When they click the button `Log out`, they are deconnected and redirected to the page `/signin`.

When the user presses the `Log in` button in the login page, the page requests `POST /auth/login` with the credentials as body.

When the user presses the `Log out` button in the todo-list page, the page requests `POST /auth/logout`.

> In this scenario, the authentication process is handled with sessions and http redirections. You will not use [JWT tokens](https://en.wikipedia.org/wiki/JSON_Web_Token#Use) which are sometimes used in *Single Page Applications* (SPA).

## The Login and Main Pages

Download the html, css and js files by clicking [here](https://foalts.org/multi-user-todo-list-v1.zip).

Empty the `public/` directory.

Then move `script.js` and `style.css` to `public/` and the `index.html`, `signin.html` and `signup.html` files to a new directory `templates/` at the root of your project.

Open the `app.controller.ts` file and add three new routes to serve the pages.

```typescript
import { Context, controller, Get, IAppController, render, Session, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { createConnection } from 'typeorm';

import { ApiController } from './controllers';
import { User } from './entities';

@UseSessions({
  cookie: true,
  user: fetchUser(User)
})
export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController)
  ];

  async init() {
    await createConnection();
  }

  @Get('/')
  index() {
    return render('templates/index.html');
  }

  @Get('/signin')
  signin(ctx: Context<any, Session>) {
    return render('templates/signin.html', { error: ctx.session.get('error', '') });
  }

  @Get('/signup')
  signup() {
    return render('templates/signup.html');
  }
}
```

Open your browser and go to `http://localhost:3001/signin`. The login page should show up.

## Login Controllers

The next step is to create a controller that logs the users in or out and redirects them after the operation succeeds or fails. It needs two routes `/login` and `/logout`.

```
foal generate controller auth --register
```

> The `--register` flag directly adds a new line in `app.controller.ts` to declare the `AuthController` as a sub-controller of `AppController`.

Open the new file `auth.controller.ts` and replace its content.

```typescript
// 3p
import {
  Context, dependency, HttpResponseRedirect, Post, Session,
  Store, ValidateBody, verifyPassword
} from '@foal/core';

import { User } from '../entities';

export class AuthController {
  // This line is required.
  @dependency
  store: Store;

  @Post('/login')
  // Validate the request body.
  @ValidateBody({
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
    },
    required: ['email', 'password'],
    type: 'object',
  })
  async login(ctx: Context<User, Session>) {
    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      // Redirect the user to /signin if the authentication fails.
      ctx.session.set('error', 'Invalid email or password.', { flash: true });
      return new HttpResponseRedirect('/signin');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      // Redirect the user to /signin if the authentication fails.
      ctx.session.set('error', 'Invalid email or password.', { flash: true });
      return new HttpResponseRedirect('/signin');
    }

    // Associate the current session with the authenticated user.
    ctx.session.setUser(user);

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/');
  }

  @Post('/logout')
  async logout(ctx: Context) {
    // Destroy the user session.
    if (ctx.session) {
      await ctx.session.destroy();
    }

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/signin');
  }
}

```

> Writting `User.findOne({ email: email, password: password })` cannot work since the password needs to be hashed.

Go back to your browser and try to log in with the email `john@foalts.org` and the password `mary_password`. You are redirected to the same page and the message `Invalid email or password.` shows up. Now use the password `john_password` and try to log in. You are redirected to the todo-list page where all todos are listed. If you click on the button `Log out` you are then redirected to the login page!

## Access control

Great, so far you can authenticate users. But as you have not yet added access control to the todo-list page and the API, unauthenticated users can still access it.

The usual way to handle authorization is to use a *hook*. In this case, you are going to use the built-in hook `UserRequired` which returns a 401 error or redirects the user if user is not logged in. 

Update `app.controller.ts`.

```typescript
import { Context, controller, Get, IAppController, render, Session, UserRequired, UseSessions } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

import { ApiController, AuthController } from './controllers';

// ...
export class AppController extends IAppController {

  // ...

  @Get('/')
  @UserRequired({
    // Redirect to /signin if the user is not authenticated.
    redirectTo: '/signin'
  })
  index() {
    // ...
  }

  // ...

}
```

Update `api.controller.ts`.

```typescript
import {
  Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent,
  HttpResponseNotFound, HttpResponseOK, Post,
  UserRequired, ValidateBody, ValidatePathParam
} from '@foal/core';
import { fetchUser, TypeORMStore } from '@foal/typeorm';

import { Todo, User } from '../entities';

@UserRequired()
export class ApiController {

  ...

}
```

> When a hook decorates a controller class, it applies to all the routes of the controller and its sub-controllers.

Go to `http://localhost:3001`. If you are not logged in you should be redirected to the login page.
