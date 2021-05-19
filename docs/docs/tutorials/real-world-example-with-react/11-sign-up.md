---
title: Adding Sign Up
---

So far, only users created with the `create-user` script can log in and publish stories. In this section you will add a new API endpoint for users to sign up with the registration page.

| API endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Registers a new user. An email and a password are expected in the request body. |

Open the `auth.controller.ts` file and add a new route.

```typescript
import { Context, hashPassword, HttpResponseNoContent, HttpResponseOK, HttpResponseUnauthorized, Post, ValidateBody, verifyPassword } from '@foal/core';
import { User } from '../../entities';

const credentialsSchema = {
  // ...
};

export class AuthController {

  // login...

  // logout...

  @Post('/signup')
  @ValidateBody(credentialsSchema)
  async signup(ctx: Context) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = new User();
    user.email = email;
    user.avatar = '';
    user.name = 'Unknown';
    user.password = await hashPassword(password);
    await user.save();

    // This line logs the user in.
    ctx.session?.setUser(user);
    // For security reason, it is a recommended practice
    // to regenerate the session ID when a user logs in
    // or when a password is changed.
    await ctx.session?.regenerateID();

    return new HttpResponseOK({
      id: user.id,
      name: user.name,
    });
  }

}

```

If you go the [sign up page](http://localhost:3001/signup), you should now be able to register as a new user.