# Auth Controllers and Hooks

So far, you have defined the `User` model and written a script to create new users with their password and email address. The next step is to create a controller to log users in or out. Here is what we want:

1. Users load the page `/signin`, enter their credentials and then are redirected to the page `/` if the credentials are correct. If they are not, users are redirected to `/signin?bad_credentials=true`. The `bad_credentials` parameter tells the page to show the error message `Invalid email or password`.
1. Users can view, create and delete their todos in the page `/`.
1. When they click the button `Log out`, they are deconnected and redirected to the page `/signin`.

When the user presses the `Log in` button in the login page, the page requests `POST /auth/login` with the credentials as body.

When the user presses the `Log out` button in the todo-list page, the page requests `GET /auth/logout`.

> In this scenario, the authentication process is handled with sessions and http redirections. You will not use [JWT tokens](https://en.wikipedia.org/wiki/JSON_Web_Token#Use) which are sometimes used in *Single Page Applications* (SPA).

## The Login and Main Pages

Download the html, css and js files by clicking [here](https://foalts.org/multi-user-todo-list.zip).

Empty the `public/` directory.

Then move `script.js` and `style.css` to `public/` and the `index.html`, `signin.html` and `signup.html` templates to `src/app/controllers/templates/`.

Open the `app.controller.ts` file and add three new routes to serve the pages.

```typescript
import { controller, Get, render } from '@foal/core';

import { ApiController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController)
  ];

  @Get('/')
  index() {
    return render('./controllers/templates/index.html', {}, __dirname);
  }

  @Get('/signin')
  signin() {
    return render('./controllers/templates/signin.html', {}, __dirname);
  }

  @Get('/signup')
  signup() {
    return render('./controllers/templates/signup.html', {}, __dirname);
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
  Context, Get, HttpResponseRedirect,
  logIn, logOut, Post, ValidateBody, verifyPassword
} from '@foal/core';
import { getRepository } from 'typeorm';

import { User } from '../entities';

export class AuthController {

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
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      // Redirect the user to /signin if the authentication fails.
      return new HttpResponseRedirect('/signin?bad_credentials=true');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      // Redirect the user to /signin if the authentication fails.
      return new HttpResponseRedirect('/signin?bad_credentials=true');
    }

    // Add the user to the current session.
    logIn(ctx, user);

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/');
  }

  @Get('/logout')
  logout(ctx) {
    // Remove the user from the session.
    logOut(ctx);

    // Redirect the user to the signin page.
    return new HttpResponseRedirect('/signin');
  }
}

```

> Writting `getRepository(User).findOne({ email: email, password: password })` cannot work since the password needs to be hashed.

Go back to your browser and try to log in with the email `john@foalts.org` and the password `mary_password`. You are redirected to the same page and the message `Invalid email or password.` shows up. Now use the password `john_password` and try to log in. You are redirected to the todo-list page where all todos are listed. If you click on the button `Log out` you are then redirected to the login page!

## The LoginRequired Hook

Great, so far you can authenticate users. But as you have not yet added access control to the todo-list page and the API, unauthenticated users can still access it.

The usual way to handle authorization is to use a *hook*. In this case, you are going to use the built-in hook `LoginRequired` which returns a 401 error or redirects the user if no user was logged in. 

Update the controllers.

```typescript
import { controller, Get, LoginRequired, render } from '@foal/core';
import { fetchUser } from '@foal/typeorm';

import { ApiController, AuthController } from './controllers';
import { User } from './entities';

export class AppController {

  @Get('/')
  @LoginRequired({ redirect: '/signin', user: fetchUser(User) })
  index() {
    ...
  }

  ...

}
```

```typescript
@LoginRequired({ user: fetchUser(User) })
export class ApiController {

  ...

}
```

> When a hook decorates a controller class, it applies to all the routes of the controller and its sub-controllers.

Go to `http://localhost:3001`. If you are not logged in you should be redirected to the login page.
