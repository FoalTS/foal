---
title: Protección contra CSRF
id: tuto-13-csrf
slug: 13-csrf
---

Dado que utiliza la autenticación con cookies, necesita añadir protección CSRF a su aplicación. Esto es realmente fácil con Foal, incluso cuando se construye un SPA.

Abra el archivo de configuración `default.json` y habilite la protección CSRF.

```json
{
  "port": "env(PORT)",
  "settings": {
    "session": {
      "store": "@foal/typeorm",
      "csrf": {
        "enabled": true
      }
    },
    ...
  }
  ...
}
```

Ahora, al utilizar sesiones con cookies, el servidor enviará un token adicional al cliente en una cookie denominada `XSRF-Token`. Este token tendrá que ser recuperado por la aplicación front-end y enviado de vuelta en cada petición POST, PATCH, PUT y DELETE posterior con la cabecera `X-XSRF-Token`. Si no es así, el servidor devolverá un error 403.

Si utiliza [axios](https://www.npmjs.com/package/axios) como su biblioteca de peticiones, como en este tutorial, no tiene que hacer nada. Todo se maneja en segundo plano. 

Si reinicia su servidor de desarrollo y abre las herramientas de desarrollo de su navegador, verá que axios incluye automáticamente el token por usted al crear una nueva publicación.

![X-XSRF-Token header example](./images/csrf.png)