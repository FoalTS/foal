---
title: Añadida de la página de inscripción
id: tuto-11-sign-up
slug: 11-sign-up
---

Hasta ahora, sólo los usuarios creados con el script `create-user` pueden registrarse y publicar posts. En esta sección añadirá un nuevo punto final de la API para que los usuarios se registren con la página de registro.

| Punto final | Método | Descripción |
| --- | --- | --- |
| `/api/auth/signup` | `POST` | Registra un nuevo usuario. Se espera un correo electrónico y una contraseña en el cuerpo de la solicitud. |

Abra el archivo `auth.controller.ts` y añada una nueva ruta.

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
  async signup(ctx: Context<User|null>) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = new User();
    user.email = email;
    user.avatar = '';
    user.name = 'Unknown';
    user.password = await hashPassword(password);
    await user.save();

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseOK({
      id: user.id,
      name: user.name,
    });
  }


}

```

Si va a la [página de registro](http://localhost:3000/signup), ahora debería poder registrarse como nuevo usuario.