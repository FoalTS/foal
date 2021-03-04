---
title: La Página de Inscripción
---

La página de registro, que se sirve en el `AppController`, realiza una petición `POST /signup` cuando se pulsa el botón `Create an account`.

Cree un nuevo controlador para manejar esta ruta.

```
foal generate controller signup --register
```

Abra el nuevo archivo y sustituya su contenido.

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

Ahora puede crear nuevos usuarios con la página de registro.