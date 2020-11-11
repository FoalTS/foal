# The Sign Up Page

The sign up page, that is served in the app controller, makes a request `POST /signup` when the button `Create an account` is pressed.

Create a new controller to handle this route.

```
foal generate controller signup --register
```

Open the new file and replace its content.

```typescript
// 3p
import { Context, HttpResponseRedirect, Post, Store, UseSessions, ValidateBody } from '@foal/core';
import { isCommon } from '@foal/password';

// App
import { User } from '../entities';

export class SignupController {

  @Post()
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  @UseSessions({
    cookie: true
  })
  async signup(ctx: Context) {
    // Check that the password is not too common.
    if (await isCommon(ctx.request.body.password)) {
      ctx.session.set('error', 'Password too password.', { flash: true });
      return new HttpResponseRedirect('/signup');
    }

    // Check that no user has already signed up with this email.
    let user = await getRepository(User).findOne({ email: ctx.request.body.email });
    if (user) {
      ctx.session.set('error', 'Email already taken.', { flash: true });
      return new HttpResponseRedirect('/signup');
    }

    // Create the user.
    user = new User();
    user.email = ctx.request.body.email;
    await user.setPassword(ctx.request.body.password);
    await user.save();

    // Log the user in.
    ctx.session.setUser(user);

    // Redirect the user to her/his to-do list.
    return new HttpResponseRedirect('/');
  }

}

```

You can now create new users with the signup page.