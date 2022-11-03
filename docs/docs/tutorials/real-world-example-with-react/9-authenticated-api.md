---
title: Authenticating Users in the API
id: tuto-9-authenticated-api
slug: 9-authenticated-api
---

Now that the login is configured, you can add two new routes to create and delete stories. Their access will be limited to authenticated users. 

| API endpoint | Method | Description |
| --- | --- | --- |
| `/api/stories` | `POST` | Creates a new story. |
| `/api/stories/:storyId` | `DELETE` | Deletes a story. |

Open the `stories.controller.ts` file and add two new methods to the controller.

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

When sending a request to these endpoints, the `@UserRequired` hook will return a 401 error if `ctx.user` is null (i.e. if the user has not logged in first). But if it is, the controller method will be executed.

Go to [http://localhost:3001/swagger](http://localhost:3001/swagger) and check that the controller is working as expected. You can, for example, first try to create a story without being connected and then log in and try again.