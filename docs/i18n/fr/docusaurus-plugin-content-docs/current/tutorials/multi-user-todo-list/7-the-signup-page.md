---
title: La Page d'Inscription
---

La page d'inscription, qui est servie dans le contrôleur principal de l'application, envoie une requête `POST /signup` lorsque le bouton `Create an account` est pressé.

Créez un nouveau contrôleur pour gérer cette route.

```
foal generate controller signup --register
```

Ouvrez le nouveau fichier et remplacez son contenu.

```typescript
// 3p
import { Context, HttpResponseRedirect, Post, Session, ValidateBody } from '@foal/core';
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
  async signup(ctx: Context<User, Session>) {
    // Check that the password is not too common.
    if (await isCommon(ctx.request.body.password)) {
      ctx.session.set('error', 'Password too common.', { flash: true });
      return new HttpResponseRedirect('/signup');
    }

    // Check that no user has already signed up with this email.
    let user = await User.findOne({ email: ctx.request.body.email });
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

Vous pouvez maintenant créer de nouveaux utilisateurs grâce à la page d'inscription.
