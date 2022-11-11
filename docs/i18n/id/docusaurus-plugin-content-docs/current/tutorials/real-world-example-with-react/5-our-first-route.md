---
title: Your First Route
id: tuto-5-our-first-route
slug: 5-our-first-route
---

The database is now filled with some stories. Let's implement the first route to retrieve them.

| API endpoint | Method | Description |
| --- | --- | --- |
| `/api/stories` | `GET` | Lists the stories of all users. An optional query parameter `authorId` can be provided to filter the stories to be returned. |

First, generate the story controller.

```bash
foal generate controller api/stories --register
```

A new file appears in the `api` subdirectory. Open it and replace its contents.

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

The `readStories` method retrieves and returns the stories along with some information about their authors.

When requesting this endpoint, the response body will look like this:
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