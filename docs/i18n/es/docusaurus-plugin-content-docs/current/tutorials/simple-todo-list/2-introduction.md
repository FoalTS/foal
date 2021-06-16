---
title: Introducción
id: tuto-2-introduction
slug: 2-introduction
---

La aplicación que creará es una simple lista de tareas. Consiste en una parte frontend que ya ha sido escrita para usted y una parte backend que será el tema de este tutorial.

Primero descargue los archivos html, css y js haciendo clic [aquí](https://foalts.org/simple-todo-list.zip).

Ponga los archivos descargados y descomprimidos en el directorio estático `public/`.

El código que se ejecuta en el navegador hará llamadas a la API del servidor para ver, crear y eliminar las tareas.

Actualice la página. Ahora debería ver esto:

![Browser view](./app.png)

> Como todavía no ha implementado la API del servidor, el frontend obtiene un error al recuperar las tareas. Aparece en la parte inferior de la página. Si intenta escribir algo en la entrada de texto y pulsa Enter para crear una nueva tarea, también obtendrá un error.

Veamos los detalles de la API que queremos construir.

**Enumerar las tareas**
- Solicitud:
  - método: `GET`
  - ruta: `/api/todos`
- Respuesta:
  - estado: 200 (OK)
  - cuerpo: 
    ```json
    [
      { "id": 1, "text": "Task 1" },
      { "id": 2, "text": "Task 2" },
    ]
    ```

**Crear una tarea**
- Solicitud:
  - método: `POST`
  - ruta: `/api/todos`
  - cuerpo:
    ```json
    {
      "text": "Task 3"
    }
    ```
- Respuesta:
  - estado: 201 (Created)
  - cuerpo: 
    ```json
    {
      "id": 3,
      "text": "Task 3"
    }
    ```

**Eliminar una tarea**
- Solicitud:
  - método: `DELETE`
  - ruta: `/api/todos/3`
- Respuesta:
  - estado: 204 (No Content)
