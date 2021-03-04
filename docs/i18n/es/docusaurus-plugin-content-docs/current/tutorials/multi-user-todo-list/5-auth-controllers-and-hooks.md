---
title: Controladores y Hooks de Autentificación
---

Hasta ahora, ha definido el modelo `Usuario` y ha escrito un script para crear nuevos usuarios con su contraseña y dirección de correo electrónico. El siguiente paso es crear un controlador para que los usuarios puedan connectarse.

Esta es la arquitectura que queremos:

1. Los usuarios abren la página `/signin`, introducen sus credenciales y luego son redirigidos a la página `/` si las credenciales son correctas. Si no lo son, la página se actualiza con un mensaje de error.
1. Los usuarios pueden ver, crear y eliminar sus temas en la página `/`.
1. Cuando pulsan el botón `Log out`, se desconectan y son redirigidos a la página `/signin`.

Cuando el usuario pulsa el botón `Log in` en la página de inicio de sesión, la página solicita `POST /auth/login` con las credenciales como cuerpo.

Cuando el usuario pulsa el botón `Log out` en la página de lista de tareas, la página solicita `POST /auth/logout`.

> En este escenario, el proceso de autenticación se maneja con sesiones y redirecciones http. No se utilizarán [tokens JWT](https://en.wikipedia.org/wiki/JSON_Web_Token#Use) que a veces se utilizan en las aplicaciones de una sola página (*Single Page Applications* o *SPA*).

## Las Páginas de Inicio de Sesión y Principal

Descargue los archivos html, css y js pulsando [aquí](https://foalts.org/multi-user-todo-list-v2.zip).

Vacíe el directorio `public/`.

Luego mueva `script.js` y `style.css` a `public/` y los archivos `index.html`, `signin.html` y `signup.html` a un nuevo directorio `templates/` en la raíz de su proyecto.

Abra el archivo `app.controller.ts` y añada tres nuevas rutas para servir las páginas.

```typescript
import { Context, controller, Get, IAppController, render, Session, UseSessions } from '@foal/core';
import { fetchUser } from '@foal/typeorm';
import { createConnection } from 'typeorm';

import { ApiController } from './controllers';
import { User } from './entities';

@UseSessions({
  cookie: true,
  user: fetchUser(User)
})
export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController)
  ];

  async init() {
    await createConnection();
  }

  @Get('/')
  index() {
    return render('templates/index.html');
  }

  @Get('/signin')
  signin(ctx: Context<any, Session>) {
    return render('templates/signin.html', { error: ctx.session.get('error', '') });
  }
  
  @Get('/signup')
  signup(ctx: Context<any, Session>) {
    return render('templates/signup.html', { error: ctx.session.get('error', '') });
  }
}
```

Abra su navegador y vaya a `http://localhost:3001/signin`. Debería aparecer la página de inicio de sesión.

## Controladores de Conexión

El siguiente paso es crear un controlador que conecte a los usuarios y los redirija después de que la operación tenga éxito o falle. Necesita dos rutas `/login` y `/logout`.

```
foal generate controller auth --register
```

> La bandera `--register` añade directamente una nueva línea en `app.controller.ts` para declarar el `AuthController` como un subcontrolador de `AppController`.

Abra el nuevo archivo `auth.controller.ts` y reemplace su contenido.

```typescript
// 3p
import {
  Context, dependency, HttpResponseRedirect, Post, Session,
  Store, ValidateBody, verifyPassword
} from '@foal/core';

import { User } from '../entities';

export class AuthController {
  // This line is required.
  @dependency
  store: Store;

  @Post('/login')
  // Validate the request body.
  @ValidateBody({
    additionalProperties: false,
    properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' }
    },
    required: ['email', 'password'],
    type: 'object',
  })
  async login(ctx: Context<User, Session>) {
    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      // Redirect the user to /signin if the authentication fails.
      ctx.session.set('error', 'Invalid email or password.', { flash: true });
      return new HttpResponseRedirect('/signin');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      // Redirect the user to /signin if the authentication fails.
      ctx.session.set('error', 'Invalid email or password.', { flash: true });
      return new HttpResponseRedirect('/signin');
    }

    // Associate the current session with the authenticated user.
    ctx.session.setUser(user);

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/');
  }

  @Post('/logout')
  async logout(ctx: Context) {
    // Destroy the user session.
    if (ctx.session) {
      await ctx.session.destroy();
    }

    // Redirect the user to the home page on success.
    return new HttpResponseRedirect('/signin');
  }
}

```

> Escribir `User.findOne({ email: email, password: password })` no puede funcionar ya que la contraseña necesita ser hash.

Vuelva a su navegador e intente conectarse con el correo electrónico `john@foalts.org` y la contraseña `mary_password`. Se le redirige a la misma página y aparece el mensaje `Invalid email or password.`. Ahora utilice la contraseña `john_password` e intente conectarse. Se le redirige a la página de tareas. Si hace clic en el botón `Log out` será redirigido a la página de inicio de sesión.

## Control de Acceso

Genial, hasta ahora puede autenticar a los usuarios. Pero como todavía no ha añadido el control de acceso a la página de la lista de tareas y a la API, los usuarios no autentificados pueden seguir accediendo a ella.

La forma habitual de gestionar la autorización es utilizar un *hook*. En este caso, va a utilizar el hook incorporado `UserRequired` que devuelve un error 401 o redirige al usuario si éste no está conectado. 

Actualice `app.controller.ts`.

```typescript
import { Context, controller, Get, IAppController, render, Session, UserRequired, UseSessions } from '@foal/core';

import { ApiController, AuthController } from './controllers';

// ...
export class AppController extends IAppController {

  // ...

  @Get('/')
  @UserRequired({
    // Redirect to /signin if the user is not authenticated.
    redirectTo: '/signin'
  })
  index() {
    // ...
  }

  // ...

}
```

Actualice `api.controller.ts`.

```typescript
import {
  Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent,
  HttpResponseNotFound, HttpResponseOK, Post,
  UserRequired, ValidateBody, ValidatePathParam
} from '@foal/core';

import { Todo, User } from '../entities';

@UserRequired()
export class ApiController {

  ...

}
```

> Cuando un hook decora una clase de controlador, se aplica a todas las rutas del controlador y sus subcontroladores.

Vaya a `http://localhost:3001`. Si no está conectado, debería ser redirigido a la página de acceso.
