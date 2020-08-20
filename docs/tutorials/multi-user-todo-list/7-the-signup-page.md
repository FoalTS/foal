# The Sign Up Page

The sign up page, that is served in the app controller, makes a request `POST /signup` when the button `Create an account` is pressed.

Create a new controller to handle this route.

```
foal generate controller signup --register
```

Open the new file and replace its content.

```typescript
// 3p
import { Context, dependency, HttpResponseRedirect, Post, TokenOptional, ValidateBody } from '@foal/core';
import { isCommon } from '@foal/password';
import { TypeORMStore } from '@foal/typeorm';
import { getRepository } from 'typeorm';

// App
import { User } from '../entities';

export class SignupController {
  @dependency
  store: TypeORMStore;

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
  @TokenOptional({
    cookie: true,
    redirectTo: '/signin',
    store: TypeORMStore,
  })
  async signup(ctx: Context) {
    // Check that the password is not too common.
    if (await isCommon(ctx.request.body.password)) {
      return new HttpResponseRedirect('/signup?password_too_common=true');
    }

    // Check that no user has already signed up with this email.
    let user = await getRepository(User).findOne({ email: ctx.request.body.email });
    if (user) {
      return new HttpResponseRedirect('/signup?email_already_taken=true');
    }

    // Create the user.
    user = new User();
    user.email = ctx.request.body.email;
    await user.setPassword(ctx.request.body.password);
    await getRepository(User).save(user);

    // Create the user session.
    ctx.session = await createSession(this.store);
    ctx.session = session.setUser(user);

    // Redirect the user to her/his to-do list.
    return new HttpResponseRedirect('/');
  }

}

```

You can now create new users with the signup page.