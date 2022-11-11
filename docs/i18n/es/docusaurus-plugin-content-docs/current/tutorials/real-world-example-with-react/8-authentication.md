---
title: Conexión de los Usuarios
id: tuto-8-authentication
slug: 8-authentication
---

Los posts se muestran en la página de inicio. Si queremos que los usuarios puedan publicar nuevos posts y subir una foto de perfil, tenemos que permitirles iniciar sesión en la aplicación.

Para ello, utilizaremos las sesiones de Foal con cookies.

> FoalTS ofrece muchas opciones para autenticar a los usuarios. Por ejemplo, puede enviar tokens de sesión con la cabecera `Authorization` o utilizar tokens sin estado con JWT. No exploraremos todas estas posibilidades en este tutorial pero puede encontrar la documentación completa [aquí](../../authentication/quick-start.md).

Abra el archivo `api.controller.ts` y añada el hook `@UseSessions` en la parte superior de la clase.

```typescript
import { ApiInfo, ApiServer, controller, UseSessions } from '@foal/core';
import { User } from '../entities';
import { StoriesController } from './api';

@ApiInfo({
  title: 'Application API',
  version: '1.0.0'
})
@ApiServer({
  url: '/api'
})
@UseSessions({
  cookie: true,
  user: (id: number) => User.findOneBy({ id }),
})
export class ApiController {

  subControllers = [
    controller('/stories', StoriesController),
  ];

}

```

Cuando se utiliza con la opción `cookie`, este hook asegura que `ctx.session` se defina siempre en cada método del controlador y sus subcontroladores. Este objeto puede ser utilizado para almacenar información entre múltiples consultas, como un ID de usuario por ejemplo. Se utilizará para autenticar a los usuarios.

> En segundo plano, Foal genera un token de sesión único para cada usuario que utiliza la API y lo almacena en una cookie en el host del cliente. Cuando el cliente realiza una nueva solicitud, el navegador envía automáticamente el token con la solicitud para que el servidor pueda recuperar la información de la sesión. Los datos de la sesión se almacenan en la base de datos en la tabla *sessions*.
>
> Pero no tiene que preocuparse por ello, todo es gestionado por Foal.

Cree un nuevo controlador.

```bash
foal generate controller api/auth --register
```

Abra el nuevo archivo creado y añada dos rutas.

| Punto final | Método | Descripción |
| --- | --- | --- |
| `/api/auth/login` | `POST` | Inicia la sesión del usuario. Se espera un correo electrónico y una contraseña en el cuerpo de la solicitud. |
| `/api/auth/logout` | `POST` | Cierra la sesión del usuario. |

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
  async login(ctx: Context<User|null>) {
    const email = ctx.request.body.email;
    const password = ctx.request.body.password;

    const user = await User.findOneBy({ email });
    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!(await verifyPassword(password, user.password))) {
      return new HttpResponseUnauthorized();
    }

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseOK({
      id: user.id,
      name: user.name,
    });
  }

  @Post('/logout')
  async logout(ctx: Context) {
    await ctx.session!.destroy();
    return new HttpResponseNoContent();
  }

}

```

El método `login` comprueba primero que el usuario existe y que las credenciales proporcionadas son correctas. Si es así, asocia el usuario a la sesión actual.

En las siguientes consultas, el hook *UseSessions* recuperará el ID del usuario de la sesión y establecerá la propiedad `ctx.user` en consecuencia. Si el usuario no se ha conectado previamente, entonces `ctx.user` será `null`. Si lo ha hecho, entonces `ctx.user` será una instancia de `User`. Esto es posible gracias a la opción `user` que proporcionamos al hook anteriormente. Es la función que toma el ID de usuario como parámetro y devuelve el valor a asignar a `ctx.user`.

