---
title: Construcción de Producción
id: tuto-14-production-build
slug: 14-production-build
---

Hasta ahora, las aplicaciones front-end y back-end están compiladas y servidas por dos servidores de desarrollo diferentes. El siguiente paso es construirlas en una sola lista para producción.

## Construir la aplicación React

En su directorio de front-end, ejecute el siguiente comando:

```bash
npm run build
```

Este comando construye la aplicación React para producción y guarda los archivos en el directorio `build`.

Ábralo y copie todo su contenido en el directorio `public` de su aplicación Foal.

> Cuando utilice `foal connect` con Angular o Vue, el frontend build guardará automáticamente los archivos en `public`.

Ahora, si navega a [http://localhost:3001](http://localhost:3001), verá la aplicación frontend servida por el servidor backend.

## Prevención de errores 404

Abra el enlace [http://localhost:3001/login](http://localhost:3001/login) en una nueva pestaña. El servidor devuelve un error 404.

Esto es perfectamente normal. En este momento, el servidor no tiene un manejador para la ruta `/login` y por lo tanto devuelve este error. Anteriormente, este problema era manejado por el servidor de desarrollo de React, por lo que no existía este error.

Para resolver este problema, añadirá un método de controlador que procesará las peticiones no gestionadas.

Abra `app.controller.ts` y actualice su contenido.

```typescript
import { Context, controller, Get, HttpResponseNotFound, IAppController, render } from '@foal/core';

import { ApiController, OpenapiController } from './controllers';

export class AppController implements IAppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/swagger', OpenapiController)
  ];

  @Get('*')
  renderApp(ctx: Context) {
    if (!ctx.request.accepts('html')) {
      return new HttpResponseNotFound();
    }

    return render('./public/index.html');
  }
}

```

Este método devuelve la aplicación React para cualquier solicitud GET que acepte contenido HTML y que no haya sido manejada por los otros métodos del controlador y sus subcontroladores.

Si vuelve a [http://localhost:3001/login](http://localhost:3001/login) y actualiza la página, debería aparecer la página de acceso.

## Construir la aplicación Foal

Ahora, si quiere construir la aplicación backend para no utilizar la opción `npm run dev`, puede ejecutar este comando:

```bash
npm run build
```

Luego, para lanzar la aplicación, simplemente ejecute lo siguiente:

```bash
npm run start
```