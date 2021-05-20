---
title: Logging Users In and Out
---

Stories are now displayed on the home page. If we want users to be able to post new stories and upload a profile picture, we need to allow them to log in to the application.

To do this, we will use Foal's sessions with cookies.

Open the file `api.controller.ts` and add the `@UseSessions` hook at the top of the class.

```typescript
import { ApiInfo, ApiServer, controller, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { User } from '../entities';
import { AuthController, ProfileController, StoriesController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
@UseSessions({
  cookie: true,
  user: fetchUser(User),
})
export class ApiController {

  subControllers = [
    controller('/stories', StoriesController),
  ];

}

```

When used with the `cookie` option, this hook ensures that `ctx.session` is always defined in every method of the controller and its subcontrollers. This object can be used to store information between multiple requests, such as a user ID for example. You will use it to authenticate users.

Create a new controller.

```bash
foal generate controller api/auth --register.
```

Open the new created file and add two routes.

| API endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Logs the user in. An email and a password are expected in the request body. |
| `/api/auth/logout` | `POST` | Logs the user out. |

```typescript
import { Context, hashPassword, HttpResponseNoContent, HttpResponseOK, HttpResponseUnauthorized, Post, ValidateBody, verifyPassword } from '@foal/core';
import { User } from '../../entities';

const credentialsSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' }
  },
  required: [ 'email', 'password' ],
  additionalProperties: false,
};

export class AuthController {

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = await User.findOne({ email });
    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!(await verifyPassword(password, user.password))) {
      return new HttpResponseUnauthorized();
    }

    ctx.session?.setUser(user);
    // For security reason, it is recommended practice to regenerate
    // the session ID on login.
    await ctx.session?.regenerateID();

    // Return the user description to the client.
    return new HttpResponseOK({
      id: user.id,
      name: user.name,
    });
  }

  @Post('/logout')
  async logout(ctx: Context) {
    await ctx.session?.destroy();
    return new HttpResponseNoContent();
  }

}

```

The `login` method first checks that the user exists and that the credentials provided are correct. If so, it associates the user with the current session.

On subsequent requests, the *UseSessions* hook will retrieve the user's ID from the session and set the `ctx.user` property accordingly. If the user has not previously logged in, then `ctx.user` will be `undefined`. If they have, then `ctx.user` will be an instance of `User`.

> *You may have noticed that we provided another option to the `@UseSessions` hook earlier, called `user`. This option is actually the function that takes the user ID as parameter and returns the value to assign to `ctx.user`.*
