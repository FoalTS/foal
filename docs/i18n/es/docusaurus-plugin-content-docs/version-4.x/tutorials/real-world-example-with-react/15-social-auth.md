---
title: Autenticación Social con Google
id: tuto-15-social-auth
slug: 15-social-auth
---

En esta última parte del tutorial, daremos a los usuarios la posibilidad de iniciar sesión con Google. Actualmente, sólo pueden iniciar sesión con un correo electrónico y una contraseña.

Para ello, utilizará el sistema de autenticación social de Foal.

> *Esta sección supone que ya ha configurado una aplicación de Google y ha recuperado su ID de cliente y su secreto. Si no lo ha hecho, es posible que quiera consultar primero esta [página](../../authentication/social-auth.md). Los URI de redirección permitidos en su aplicación de Google deben incluir `http://localhost:3001/api/auth/google/callback`.*


## Contraseñas anulables

El primer paso es actualizar el modelo `User`. Es posible que algunos usuarios sólo utilicen el inicio de sesión social y, por lo tanto, no tengan una contraseña. Para tener esto en cuenta, haremos que la columna `password` acepte valores nulos.

Abra `user.entity.ts` y actualice su contenido.

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

}

export { DatabaseSession } from '@foal/typeorm';
```

Realice y ejecute las migraciones.

```bash
npm run makemigrations
npm run migrations
```

A continuación, abra `auth.controller.ts` y añada una condición para comprobar si el valor de la contraseña es `null` en la base de datos.

```typescript
if (!user.password) {
  return new HttpResponseUnauthorized();
}

if (!(await verifyPassword(password, user.password))) {
  return new HttpResponseUnauthorized();
}
```

## Configuración

Ahora que el problema de la contraseña está resuelto, puede instalar los paquetes y proporcionar sus credenciales sociales en la configuración.

```bash
npm install @foal/social node-fetch@2
```

*config/default.json*
```json
{
  "port": "env(PORT)",
  "settings": {
    ...
    "social": {
      "google": {
        "clientId": "env(GOOGLE_CLIENT_ID)",
        "clientSecret": "env(GOOGLE_CLIENT_SECRET)",
        "redirectUri": "http://localhost:3001/api/auth/google/callback"
      }
    },
  },
  ...
}
```

*.env*
```bash
# ...

GOOGLE_CLIENT_ID="your Google client ID"
GOOGLE_CLIENT_SECRET="your Google client secret"
```

## El controlador social

Cree el controlador.

```bash
foal generate controller api/social-auth --register
```

Abra el archivo y añada dos nuevas rutas.

| Punto final | Método | Descripción |
| --- | --- | --- |
| `/api/auth/google` | `POST` | Redirige al usuario a la página de inicio de sesión de Google.  |
| `/api/auth/google/callback` | `GET` | Gestiona la redirección de Google una vez que el usuario ha aprobado la conexión. |

```typescript
import { Context, dependency, Get, HttpResponseRedirect } from '@foal/core';
import { GoogleProvider } from '@foal/social';
import { User } from '../../entities';
import * as fetch from 'node-fetch';
import { Disk } from '@foal/storage';

interface GoogleUserInfo {
  email: string;
  name?: string;
  picture?: string;
}

export class SocialAuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  disk: Disk;

  @Get('/google')
  redirectToGoogle() {
    return this.google.redirect();
  }

  @Get('/google/callback')
  async handleGoogleRedirection(ctx: Context<User>) {
    const { userInfo } = await this.google.getUserInfo<GoogleUserInfo>(ctx);

    if (!userInfo.email) {
      throw new Error('Google should have returned an email address.');
    }

    let user = await User.findOneBy({ email: userInfo.email });

    if (!user) {
      user = new User();
      user.email = userInfo.email;
      user.avatar = '';
      user.name = userInfo.name ?? 'Unknown';

      if (userInfo.picture) {
        const response = await fetch(userInfo.picture);
        const { path } = await this.disk.write('images/profiles/uploaded', response.body)
        user.avatar = path;
      }

      await user.save();
    }

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseRedirect('/');
  }

}

```

Abra `api.controller.ts` y sustituya el prefijo de la ruta del `SocialAuthController` por `/auth`.

```typescript
subControllers = [
  controller('/stories', StoriesController),
  controller('/auth', AuthController),
  controller('/profile', ProfileController),
  controller('/auth', SocialAuthController)
];
```

Vaya a [http://localhost:3001/login](http://localhost:3001/login) y haga clic en el botón *Connect with Google*. Será redirigido a la página de conexión de Google. Una vez que haya validado la conexión, será redirigido a la página de inicio. Si tiene una foto de perfil de Google, la verá en su página de perfil.

> Para que esto funcione, debe asegurarse de que está utilizando el puerto `3001` para probar el inicio de sesión social. Esto asume que usted creó la construcción de producción en el paso anterior de este tutorial. No puede utilizar el servidor de desarrollo de React aquí porque las redirecciones no funcionarán con ambos puertos `3000` y `3001`. 

¡Enhorabuena! Ha llegado al final de este tutorial. Puede encontrar el código fuente completo [aquí](./assets/tutorial-foal-react.zip).