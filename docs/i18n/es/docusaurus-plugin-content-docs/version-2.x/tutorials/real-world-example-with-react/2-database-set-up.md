---
title: Base de Datos (configuración)
id: tuto-2-database-set-up
slug: 2-database-set-up
---

El primer paso de este tutorial es establecer una conexión con la base de datos. Si aún no lo ha hecho, instale [MySQL](https://dev.mysql.com/downloads/) o [PostgreSQL](https://www.postgresql.org/download/).

> *Por defecto, Foal utiliza SQLite en cada nueva aplicación, ya que no requiere ninguna instalación. Si quiere seguir utilizándolo en este tutorial, puede saltarse esta sección y pasar a la siguiente página.* 

Primero, instale el controlador de MySQL (o Postgres).

```bash
npm install mysql # or pg
```

Abra el archivo `config/default.json` y actualice la sección `database` como sigue. Si su base de datos es PostgreSQL, cambie el valor de `type` a `postgres`.

```json
{
  "port": "env(PORT)",
  "settings": {
    ...
  },
  "database": {
    "type": "mysql",
    "host": "env(DB_HOST)",
    "port": "env(DB_PORT)",
    "username": "env(DB_USERNAME)",
    "password": "env(DB_PASSWORD)",
    "database": "env(DB_NAME)"
  }
}

```

Este archivo es el archivo de configuración principal de la aplicación y se utiliza como base para cualquier entorno en el que se ejecute la aplicación.

La sintaxis `env(*)` indica al sistema de configuración que debe leer el valor de la variable de entorno dada. Si no existe, Foal intentará leerlo de un archivo `.env`.

Cree un nuevo archivo `.env` en la raíz de `backend-app` y proporcione las credenciales de la base de datos.

*.env*
```bash
# Use the identification information of your database.
# The values below are given as an example.
DB_HOST="localhost"
# Default port for PostgreSQL is 5432.
DB_PORT="3306"
DB_USERNAME="test"
DB_PASSWORD="test"
DB_NAME="test"
```

Reinicie el servidor de desarrollo. La aplicación está ahora conectada a su base de datos.

> Podría haber especificado todas las opciones de conexión a la base de datos directamente en el archivo `default.json` pero esto se considera una mala práctica.
>
> Los archivos de configuración se suelen *commitar* en el control de versiones y se recomienda no *commitar* archivos que contengan información sensible.