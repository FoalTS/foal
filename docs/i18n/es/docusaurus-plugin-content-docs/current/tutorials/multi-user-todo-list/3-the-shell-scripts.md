---
title: Los Scripts Shell
---

Al igual que en el tutorial anterior, va a utilizar scripts shell para rellenar la base de datos.

## El script `create-user`

Ya existe un script llamado `create-user` en el directorio `scripts/`. Tiene un montón de líneas comentadas que le permiten crear usuarios con *permisos* y *grupos*.

Abra el archivo y sustituya su contenido por el siguiente:

```typescript
// 3p
import { isCommon } from '@foal/password';
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string; password: string }) {
  const connection = await createConnection();
  try {
    const user = new User();
    user.email = args.email;

    if (await isCommon(args.password)) {
      console.log('This password is too common. Please choose another one.');
      return;
    }
    await user.setPassword(args.password);

    console.log(await user.save());
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

Algunas partes de este código deberían resultarle familiares.

El objeto `schema` se utiliza para validar los argumentos indicados en la línea de comandos. En ese caso, el script define dos parámetros obligatorios: un correo electrónico y una contraseña. La propiedad `format` comprueba que la cadena `email` es realmente un correo electrónico (presencia del carácter `@`, etc). 

La función `main` se divide en varias partes. Primero instaura una conexión con la base de datos. Luego, crea un nuevo usuario con los argumentos especificados en la línea de comandos. La función `isCommon` compara la contraseña dada con una lista de diez mil contraseñas comunes (ej: `123456`, `password`, etc). Devuelve `true` si se encuentra en la lista. Finalmente, el usuario se graba en la base de datos y, si se produce un error, se imprime el mensaje de error.

Como habrá notado, la utilidad `isCommon` proviene del paquete `@foal/password`. Tiene que instalarla.

```
npm install @foal/password
```

Ahora construya el script.

```
npm run build
```

Cree dos nuevos usuarios.

```
foal run create-user email="john@foalts.org" password="john_password"
foal run create-user email="mary@foalts.org" password="mary_password"
```

> Si intenta volver a ejecutar uno de estos comandos, obtendrá el siguiente error, ya que la clave de correo electrónico es única.
>
> `SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email`

## El script `create-todo`

El script `create-todo` es un poco más complejo ya que `Todo` tiene una relación many-to-one con `User`.

Abra el archivo `create-todo.ts` y sustituya su contenido.

```typescript
// 3p
import { createConnection } from 'typeorm';

// App
import { Todo, User } from '../app/entities';

export const schema = {
  properties: {
    owner: { type: 'string', format: 'email' },
    text: { type: 'string' },
  },
  required: [ 'owner', 'text' ],
  type: 'object',
};

export async function main(args: { owner: string; text: string }) {
  const connection = await createConnection();
  try {
    const user = await User.findOne({ email: args.owner });

    if (!user) {
      console.log('No user was found with the email ' + args.owner);
      return;
    }

    const todo = new Todo();
    todo.text = args.text;
    todo.owner = user;

    console.log(await todo.save());
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

Hemos añadido un parámetro `propietario` para saber a qué usuario pertenece la tarea. Espera el correo electrónico del usuario.

La función `main` intenta entonces obtener el usuario que tiene este correo electrónico. Si no existe, el script termina con un mensaje mostrado en la consola. Si no, el usuario se añade a la tarea como su propietario.

Construya el script.

```
npm run build
```

Cree nuevas tareas para cada usuario.

```
foal run create-todo owner="john@foalts.org" text="John task 1"
foal run create-todo owner="john@foalts.org" text="John task 2"
foal run create-todo owner="mary@foalts.org" text="Mary task 1"
foal run create-todo owner="mary@foalts.org" text="Mary task 2"
```
