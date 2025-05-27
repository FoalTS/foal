---
title: Los Scripts Shell
id: tuto-4-the-shell-scripts
slug: 4-the-shell-scripts
---

Sus modelos están listos para ser utilizados. Como en el tutorial anterior, utilizará scripts shell para alimentar la base de datos.

## El script `create-user`

Ya existe un script llamado `create-user` en el directorio `scripts`.

Abra el archivo y sustituya su contenido por el siguiente:

```typescript
// 3p
import { hashPassword } from '@foal/core';

// App
import { User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' },
    name: { type: 'string', maxLength: 255 },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string, password: string, name?: string }) {
  const user = new User();
  user.email = args.email;
  user.password = await hashPassword(args.password);
  user.name = args.name ?? 'Unknown';
  user.avatar = '';

  await dataSource.initialize();

  try {
    console.log(await user.save());
  } catch (error: any) {
    console.log(error.message);
  } finally {
    await dataSource.destroy();
  }
}

```

Algunas partes de este código deberían resultarle familiares.

El objeto `schema` se utiliza para validar los argumentos introducidos en la línea de comandos. En este caso, el script espera dos parámetros obligatorios `email` y `password` y un `name` opcional. La propiedad `format` comprueba que la cadena `email` es un correo electrónico (presencia del carácter `@`, etc). 

La función `main` se llama después de la validación exitosa. Se divide en varias partes. Primero, crea un nuevo usuario con los argumentos especificados en la línea de comandos. Luego establece una conexión con la base de datos y guarda el usuario.

> La función `hashPassword` se utiliza para aplicar hash y sal a las contraseñas antes de almacenarlas en la base de datos. Por razones de seguridad, debe utilizar esta función antes de guardar las contraseñas.

Construya el script.

```bash
npm run build
```

A continuación, cree dos nuevos usuarios.

```bash
foal run create-user email="john@foalts.org" password="john_password" name="John"
foal run create-user email="mary@foalts.org" password="mary_password" name="Mary"
```

> Si intenta volver a ejecutar uno de estos comandos, obtendrá el siguiente error de MySQL, ya que la clave de correo electrónico es única.
>
> `ER_DUP_ENTRY: Duplicate entry 'john@foalts.org' for key 'IDX_xxx'`

## El script `create-story`

El script `create-story` es un poco más complejo ya que `Story` tiene una relación de muchos a uno con `User`.

```bash
foal generate script create-story
```

Abra el archivo `create-story.ts` y sustituya su contenido.

```typescript
import { Story, User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255 },
    title: { type: 'string', maxLength: 255 },
    link: { type: 'string', maxLength: 255 },
  },
  required: [ 'author', 'title', 'link' ],
  type: 'object',
};

export async function main(args: { author: string, title: string, link: string }) {
  await dataSource.initialize();

  const user = await User.findOneByOrFail({ email: args.author });

  const story = new Story();
  story.author = user;
  story.title = args.title;
  story.link = args.link;

  try {
    console.log(await story.save());
  } catch (error: any) {
    console.error(error);
  } finally {
    await dataSource.destroy();
  }
}

```

Hemos añadido un parámetro `author` para saber qué usuario ha publicado el post. Se espera el correo electrónico del usuario.

La función `main` intenta entonces encontrar al usuario que tiene este correo electrónico. Si existe, el usuario se añade al post como autor. Si no lo hace, el script termina con un mensaje mostrado en la consola.

Construya el script.

```bash
npm run build
```

Y cree nuevas publicaciones para cada usuario.

```bash
foal run create-story author="john@foalts.org" title="How to build a simple to-do list" link="https://foalts.org/docs/tutorials/simple-todo-list/1-installation"
foal run create-story author="mary@foalts.org" title="FoalTS architecture overview" link="https://foalts.org/docs/architecture/architecture-overview"
foal run create-story author="mary@foalts.org" title="Authentication with Foal" link="https://foalts.org/docs/authentication/quick-start"
```
