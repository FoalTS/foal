---
title: Authentification des Utilisateurs dans l'API
id: tuto-9-authenticated-api
slug: 9-authenticated-api
---

Maintenant que le login est configuré, vous pouvez ajouter deux nouvelles routes pour créer et supprimer des posts. Leur accès sera limité aux utilisateurs authentifiés. 

| Point de terminaison | Méthode | Description |
| --- | --- | --- |
| `/api/stories` | `POST` | Crée un nouveau post. |
| `/api/stories/:storyId` | `DELETE` | Supprime un post. |

Ouvrez le fichier `stories.controller.ts` et ajoutez deux nouvelles méthodes au contrôleur.

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

Lors de l'envoi d'une requête à ces points de terminaison, le hook `@UserRequired` retournera une erreur 401 si `ctx.user` est `null` (c'est-à-dire si l'utilisateur ne s'est pas connecté au préalable). Mais s'il l'est, la méthode du contrôleur sera exécutée.

Allez sur [http://localhost:3001/swagger](http://localhost:3001/swagger) et vérifiez que le contrôleur fonctionne comme prévu. Vous pouvez, par exemple, essayer de créer un post sans être connecté, puis vous connecter et réessayer.