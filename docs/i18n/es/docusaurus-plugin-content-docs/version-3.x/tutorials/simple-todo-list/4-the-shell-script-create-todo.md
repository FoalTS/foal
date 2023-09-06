---
title: El Script Shell create-todo
id: tuto-4-the-shell-script-create-todo
slug: 4-the-shell-script-create-todo
---

Ahora es el momento de poblar la base de datos con algunas tareas.

Podría ejecutar la interfaz de línea de comandos de su base de datos (en este caso *SQLite*) e introducir algunas consultas SQL. Pero esto es arriesgado y poco práctico. Se vuelve especialmente cierto cuando la complejidad de sus modelos aumenta (relaciones many-to-many, etc).

Por eso va a crear y utilizar en su lugar un *script shell*.

```sh
foal generate script create-todo
```

Un *script shell* es una pieza de código destinada a ser llamada desde la línea de comandos. Tiene acceso a todos los componentes de su aplicación, incluyendo sus modelos. Un script shell se divide en dos partes:

- un objeto `schema` que define la especificación de los argumentos de la línea de comandos,
- y una función `main` que obtiene estos argumentos como un objeto y ejecuta algún código.

Abra el nuevo archivo generado en el directorio `src/scripts` y actualice su contenido.

```typescript
// App
import { Todo } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  properties: {
    text: { type: 'string' }
  },
  required: [ 'text' ],
  type: 'object',
};

export async function main(args: { text: string }) {
  // Connect to the database.
  await dataSource.initialize();

  try {
    // Create a new task with the text given in the command line.
    const todo = new Todo();
    todo.text = args.text;

    // Save the task in the database and then display it in the console.
    console.log(await todo.save());
  } catch (error: any) {
    console.log(error.message);
  } finally {
    // Close the connection to the database.
    await dataSource.destroy();
  }
}

```

Construya el script.

```sh
npm run build
```

A continuación, ejecute el script para crear tareas en la base de datos.

```sh
foal run create-todo text="Read the docs"
foal run create-todo text="Create my first application"
foal run create-todo text="Write tests"
```

> Observe que si intenta crear una nueva tarea sin especificar el argumento del texto, obtendrá el siguiente error.
>
> `Error: The command line arguments should have required property 'text'.`
