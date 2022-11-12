---
title: Votre Première Route
id: tuto-5-our-first-route
slug: 5-our-first-route
---

La base de données est maintenant remplie avec quelques posts. Implémentons la première route pour les récupérer.

| Point de terminaison | Méthode | Description |
| --- | --- | --- |
| `/api/stories` | `GET` | Liste les posts de tous les utilisateurs. Un paramètre de requête facultatif `authorId` peut être fourni pour filtrer les posts à retourner. |

Tout d'abord, générez le contrôleur des posts.

```bash
foal generate controller api/stories --register
```

Un nouveau fichier apparaît dans le sous-répertoire `api`. Ouvrez-le et remplacez son contenu.

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

La méthode `readStories` récupère et renvoie les posts avec quelques informations sur leurs auteurs.

Lors de l'envoie d'une requête à ce point de terminaison, le corps de la réponse ressemblera à ceci :
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