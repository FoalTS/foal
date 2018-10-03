# Auth Controllers and Hooks

Now that you have the authenticator, it is time to create a controller to log users in or out. Here is what we want:

1. Users load the page `/signin`, enter their credentials and then are redirected to the page `/` if the credentials are correct. If they are not, users are redirected to `/signin?bad_credentials=true`. The `bad_credentials` parameter tells the page to show the error message `Invalid email or password`.
1. Users can view, create and delete their todos in the page `/`.
1. When they click the button `Log out`, they are deconnected and redirected to the page `/signin`.

When the user presses the `Log in` button in the login page, the page requests `POST /login` with the credentials as body.

When the user presses the `Log out` button in the todo-list page, the page requests `GET /logout`.

> In this scenario, the authentication process is handled with sessions and http redirections. You will not use [JWT tokens](https://en.wikipedia.org/wiki/JSON_Web_Token#Use) which are sometimes used in *Single Page Applications* (SPA).

## The Login and Main Pages

Download the html, css and js files by clicking [here](https://foalts.org/multi-user-todo-list.zip).

Replace the static files `script.js` and `style.js` in `public/` and move the `index.html`, `signin.html` and `signup.html` templates in `src/app/controllers/templates/`.

Open the `view.controller.ts` file and replace its content to serve the new login and signup pages.

```typescript
import { Get, render } from '@foal/core';

export class ViewController {

  @Get('/')
  index(ctx) {
    return render('./templates/index.html', {
      csrfToken: ctx.request.csrfToken(),
    }, __dirname);
  }

  @Get('/signin')
  signin(ctx) {
    return render('./templates/signin.html', {
      csrfToken: ctx.request.csrfToken(),
    }, __dirname);
  }

  @Get('/signup')
  signup(ctx) {
    return render('./templates/signup.html', {
      csrfToken: ctx.request.csrfToken(),
    }, __dirname);
  }

}

```

> The only reason why the views are not static files is that we need to include the csrf token in the pages.

Open your browser and go to `http://localhost:3000/signin`. The login page should show up.

## Login Controllers

The next step is to create a controller that logs the users in or out and redirects them after the operation succeeds or fails. It has two routes `/login` and `/logout`.

You could do it by yourself, implementing your own route handlers, but this would be a tedious work. Hopefully, FoalTS has a special controller, the `LoginController`, which takes care of that for you.

```
foal generate controller auth --register
> Login
```

Open the new file `auth.controller.ts` and complete its properties.

```typescript
// 3p
import { emailSchema, LoginController, strategy } from '@foal/core';

// App
import { Authenticator } from '../services';

export class AuthController extends LoginController {
  strategies = [
    strategy('login', Authenticator, emailSchema)
  ];

  redirect = {
    failure: '/signin?bad_credentials=true',
    logout: '/signin',
    success: '/',
  };
}

```

The `LoginController` is based on the [strategy pattern](https://en.wikipedia.org/wiki/Strategy_pattern).

An application may have several ways to authenticate a user. It can be with an email and a password as it the case here. But it also could be by using a google or twitter account.

The way users are authenticated is defined by the `authenticator` services. These services are then used as strategies by the controller.

In that case the line `strategy('login', Authenticator, emailSchema)` means:
- When a POST request is received at `/login`,
- first validate the body request with the `emailSchema`,
- and then use the `Authenticator` service to check the credentials and log the user in or not.

Go back to your browser and try to log in with the email `john@foalts.org` and the password `mary_password`. You are redirected to the same page and the message `Invalid email or password.` shows up. Now use the password `john_password` and try to log in. You are redirected to the todo-list page where all todos are listed. If you click on the button `Log out` you are then redirected to the login page!

## The LoginRequired Hook

Great, so far you can authenticate users. But as you have not yet added access control to the todo-list page and the API, unauthenticated users can still access it.

The usual way to handle authorization is to use a *hook*. In this case, you are going to use the built-in hook `LoginRequired` which returns a 403 error or redirects the user if no user was logged in. 

Update the api and view controllers.

```typescript
export class ViewController {

  @Get('/')
  @LoginRequired({ redirect: '/signin' })
  index(ctx) {
    ...
  }

  ...

}
```

```typescript
@LoginRequired()
export class ApiController {

  ...

}
```

> When a hook decorates a controller class, it applies to all the routes of the controller and its sub-controllers.

Go to `http://localhost:3000`. If you are not logged in you should be redirected to the login page.