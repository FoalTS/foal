---
title: Autenticación en la API
id: tuto-9-authenticated-api
slug: 9-authenticated-api
---

Ahora que el login está configurado, puede añadir dos nuevas rutas para crear y eliminar publicaciones. Su acceso estará limitado a los usuarios autentificados. 

| Punto final | Método | Descripción |
| --- | --- | --- |
| `/api/stories` | `POST` | Crea uno nuevo post. |
| `/api/stories/:storyId` | `DELETE` | Borra un post. |

Abra el archivo `stories.controller.ts` y añada dos nuevos métodos al controlador.

```typescript
import { Context, Delete, Get, HttpResponseCreated, HttpResponseNoContent, HttpResponseNotFound, HttpResponseOK, Post, UserRequired, ValidateBody, ValidatePathParam, ValidateQueryParam } from '@foal/core';
import { Story, User } from '../../entities';

export class StoriesController {

  // readStories...

  @Post()
  @ValidateBody({
    type: 'object',
    properties: {
      title: { type: 'string', maxLength: 255 },
      link: { type: 'string', maxLength: 255 },
    },
    required: [ 'title', 'link' ],
    additionalProperties: false,
  })
  @UserRequired()
  async createStory(ctx: Context<User>) {
    const story = new Story();
    story.title = ctx.request.body.title;
    story.link = ctx.request.body.link;
    // Set the current user as the author of the story.
    story.author = ctx.user;
    await story.save();

    return new HttpResponseCreated();
  }

  @Delete('/:storyId')
  @ValidatePathParam('storyId', { type: 'number' })
  @UserRequired()
  async deleteStory(ctx: Context<User>, { storyId }: { storyId: number }) {
    // Only retrieve stories whose author is the current user.
    const story = await Story.findOneBy({ id: storyId, author: { id: ctx.user.id } });

    if (!story) {
      return new HttpResponseNotFound();
    }

    await story.remove();

    return new HttpResponseNoContent();
  }

}
```

Al enviar una solicitud a estos puntos finales, el hook `@UserRequired` devolverá un error 401 si `ctx.user` no es `null` (es decir, si el usuario no se ha identificado primero). Pero si lo está, se ejecutará el método del controlador.

Vaya a [http://localhost:3001/swagger](http://localhost:3001/swagger) y compruebe que el controlador funciona como se espera. Puede, por ejemplo, intentar primero crear una publicación sin estar conectado y luego conectarse e intentarlo de nuevo.