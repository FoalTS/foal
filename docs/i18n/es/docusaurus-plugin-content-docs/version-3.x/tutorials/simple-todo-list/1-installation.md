---
title: Instalación
id: tuto-1-installation
slug: 1-installation
---

En este tutorial aprenderá a crear una aplicación web básica con FoalTS. La aplicación de demostración es una simple lista de tareas con la que los usuarios pueden ver, crear y eliminar sus tareas.

> **Requisitos:**
>
> [Node.js](https://nodejs.org/en/) 16 o superior

## Crear un Nuevo Proyecto

Primero necesita instalar globalmente la Interfaz de Línea de Comando (*Command Line Interface* o *CLI*) de FoalTS. Le ayudará a crear un nuevo proyecto y a generar archivos a lo largo de su desarrollo.

```sh
npm install -g @foal/cli
```

A continuación, cree una nueva aplicación.

```sh
foal createapp my-app
```

:::note

¿Tiene problemas para instalar Foal? 👉 Revise nuestra [página de solución de problemas](./installation-troubleshooting).

:::

Este comando genera un nuevo directorio con la estructura básica de la nueva aplicación. También instala todas las dependencias. Veamos lo que ha creado `createapp`:

```shell
my-app/
  config/
  node_modules/
  public/
  src/
    app/
    e2e/
    scripts/
  package.json
  tsconfig.*.json
  .eslintrc.js
```

El directorio raíz externo `my-app` es sólo un contenedor para su proyecto.
- El directorio `config/` contiene los archivos de configuración para sus diferentes entornos (producción, prueba, desarrollo, e2e, etc).
- El directorio `node_modules/` contiene todas las dependencias prod y dev de su proyecto.
- Los archivos estáticos se encuentran en el directorio `public/`. Suelen ser imágenes, CSS y archivos JavaScript del cliente y se sirven directamente cuando el servidor está en funcionamiento.
- El directorio `src/` contiene todo el código fuente de la aplicación.
  - El directorio interno `app/` incluye los componentes de su servidor (controladores, servicios y hooks).
  - Las pruebas de lado a lado se encuentran en el directorio `e2e/`.
  - La carpeta interior `scripts/` contiene los scripts destinados a ser llamados desde la línea de comandos (por ejemplo: create-user).
- El `package.json` enumera las dependencias y comandos del proyecto.
- Los archivos `tsconfig.*.json` listan la configuración del compilador de TypeScript para cada comando `npm`.
- Finalmente, la configuración de linting se encuentra en el archivo `.eslintrc.js`.

> **TypeScript**
>
> El lenguaje utilizado para desarrollar una aplicación FoalTS es [TypeScript](https://www.typescriptlang.org/). Se trata de un superconjunto tipado de JavaScript que se compila en JavaScript simple. Las ventajas de utilizar TypeScript son muchas, pero en resumen, el lenguaje proporciona grandes herramientas y las características futuras de JavaScript.

## Iniciar el Servidor

Verifiquemos que el proyecto FoalTS funciona. Ejecute los siguientes comandos:

```
cd my-app
npm run dev
```

Ha iniciado el servidor de desarrollo.

> El **servidor de desarrollo** vigila sus archivos y compila y recarga automáticamente su código. No necesita reiniciar el servidor cada vez que realice cambios en el código. Tenga en cuenta que sólo está pensado para ser utilizado en desarrollo, no lo utilice en producción.


> **¿El puerto 3001 ya está en uso?**
>
> Puede definir en `config/default.json` qué puerto utiliza la aplicación.

Vaya a [http://localhost:3001](http://localhost:3001) en su navegador. Debería ver el texto *Welcome on board*.

Enhorabuena, ¡ya tiene un servidor en funcionamiento!
