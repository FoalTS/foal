---
title: Su Primera Ruta
id: tuto-5-our-first-route
slug: 5-our-first-route
---

La base de datos está ahora llena de algunas publicaciones. Implementemos la primera ruta para recuperarlas.

| Punto final | Método | Descripción |
| --- | --- | --- |
| `/api/stories` | `GET` | Enumera las publicaciones de todos los usuarios. Se puede proporcionar un parámetro de consulta opcional `authorId` para filtrar las publicaciones a devolver. |

Primero, genere el controlador de las publicaciones.

```bash
foal generate controller api/stories --register
```

Aparece un nuevo archivo en el subdirectorio `api`. Ábralo y sustituya su contenido.

```typescript
import { Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam } from '@foal/core';
import { Story, User } from '../../entities';

export class StoriesController {
  @Get()
  @ValidateQueryParam('authorId', { type: 'number' }, { required: false })
  async readStories(ctx: Context) {
    const authorId = ctx.request.query.authorId as number|undefined;

    let queryBuilder = Story
      .createQueryBuilder('story')
      .leftJoinAndSelect('story.author', 'author')
      .select([
        'story.id',
        'story.title',
        'story.link',
        'author.id',
        'author.name'
      ]);

    if (authorId !== undefined) {
      queryBuilder = queryBuilder.where('author.id = :authorId', { authorId });
    }

    const stories = await queryBuilder.getMany();

    return new HttpResponseOK(stories);
  }
}

```


El método `readStories` recupera y devuelve las publicaciones junto con alguna información sobre sus autores.

Al enviar una consulta a este punto final, el cuerpo de la respuesta tendrá el siguiente aspecto:

```json
[
  {
    "id": 1,
    "title": "How to build a simple to-do list",
    "link": "https://foalts.org/docs/tutorials/simple-todo-list/1-installation",
    "author": {
      "id": 1,
      "name": "John"
    }
  },
  {
    "id": 2,
    "title": "FoalTS architecture overview",
    "link": "https://foalts.org/docs/architecture/architecture-overview",
    "author": {
      "id": 2,
      "name": "Mary"
    }
  },
  {
    "id": 3,
    "title": "Authentication with Foal",
    "link": "https://foalts.org/docs/authentication/quick-start",
    "author": {
      "id": 2,
      "name": "Mary"
    }
  },
]
```