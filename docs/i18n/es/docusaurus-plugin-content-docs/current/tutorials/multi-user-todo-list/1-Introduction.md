---
title: Introducción
---

> Está leyendo la documentación de la versión 2 de FoalTS. Las instrucciones para actualizar a esta versión están disponibles [aquí](../../upgrade-to-v2/README.md). La documentación antigua se puede encontrar [aquí](https://foalts.org/docs/1.x/).

En este tutorial aprenderá a gestionar usuarios, autenticación y autorización en FoalTS. También tendrá una rápida visión de las pruebas de lado a lado.

Para ello, va a crear una lista de tareas multiusuario. Ampliará la aplicación creada en el tutorial anterior [Lista de Tareas Simple](../simple-todo-list/1-installation.md) que debe seguir antes de pasar por éste.

> El código fuente del primer tutorial está disponible [aquí](https://foalts.org/simple-todo-list-source-code-v2.zip).

La aplicación tendrá tres páginas
- una página de registro en la que los usuarios podrán crear una nueva cuenta con un correo electrónico y una contraseña,
- una página de conexión que espera un correo electrónico y una contraseña para iniciar la sesión,
- y la página de la lista de tareas donde se enumeran, crean y eliminan las tareas.

Cada usuario tendrá sus propias tareas y no podrá ver, crear o eliminar las de otras personas.

Las páginas tienen el siguiente aspecto:

![Sign up page](./signup.png)
![Login page](./signin.png)
![To-do list page](./todo-list.png)

¡Empecemos!