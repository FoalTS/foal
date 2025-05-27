---
title: Image Upload and Download
id: tuto-12-file-upload
slug: 12-file-upload
---

The next step in this tutorial is to allow users to upload a profile picture. This image will be displayed on the homepage in front of each author's story.

To do this, you will use Foal's storage system. It allows you to validate and save the files uploaded by the client. These files can be saved to your local drive or in the cloud using AWS S3. We won't use the cloud feature in this tutorial, but you can find out how to configure it [here](../../common/file-storage/local-and-cloud-storage.md).

## Server Side

First, install the package. 

```bash
npm install @foal/storage
```

Update the configuration in `config/default.json` to specify the location of files that the disk manager can access.

```json
{
  "port": "env(PORT)",
  "settings": {
    ...
    "disk": {
      "local": {
        "directory": "assets"
      }
    }
  },
  ...
}
```

Then create the directory `assets/images/profiles/uploaded` where the profile images will be uploaded. Download the default profile image [here](./assets/default.png) and place it in the `assets/images/profiles` folder with the name `default.png`.

You are ready to create the controller. Generate a new one.

```bash
foal generate controller api/profile --register
```

Open the new file `profile.controller.ts` and add two new routes.

| API endpoint | Method | Description |
| --- | --- | --- |
| `/api/profile/avatar` | `GET` | Retrieves the user's profile image. If the optional query parameter `userId` is provided, the server returns the avatar of that user. Otherwise, it returns the avatar of the current user. If no user is authenticated or has no profile picture, a default image is returned. |
| `/api/profile` | `POST` | Updates the user profile. A `name` field and an optional `avatar` file are expected. |

```typescript
import { Context, dependency, File, Get, HttpResponseNoContent, Post, UserRequired, ValidateQueryParam } from '@foal/core';
import { Disk, ParseAndValidateFiles } from '@foal/storage';
import { User } from '../../entities';

export class ProfileController {
  @dependency
  disk: Disk;

  @Get('/avatar')
  @ValidateQueryParam('userId', { type: 'number' }, { required: false })
  async readProfileImage(ctx: Context<User|null>) {
    let user = ctx.user;

    const userId: number|undefined = ctx.request.query.userId;
    if (userId !== undefined) {
      user = await User.findOneBy({ id: userId })
    }

    if (!user || !user.avatar) {
      return this.disk.createHttpResponse('images/profiles/default.png');
    }

    return this.disk.createHttpResponse(user.avatar);
  }

  @Post()
  @UserRequired()
  @ParseAndValidateFiles(
    {
      avatar: { required: false, saveTo: 'images/profiles/uploaded' }
    },
    {
      type: 'object',
      properties: {
        name: { type: 'string', maxLength: 255 }
      },
      required: ['name']
    }
  )
  async updateProfileImage(ctx: Context<User>) {
    ctx.user.name = ctx.request.body.name;

    // Warning: File must be imported from `@foal/core`.
    const file: File|undefined = ctx.files.get('avatar')[0];
    if (file) {
      if (ctx.user.avatar) {
        await this.disk.delete(ctx.user.avatar);
      }
      ctx.user.avatar = file.path;
    }

    await ctx.user.save();

    return new HttpResponseNoContent();
  }

}

```

Go to [http://localhost:3001/swagger](http://localhost:3001/swagger) and try to upload a profile picture. You must be logged in first.

> You may have noticed the `@dependency` decorator for setting the `disk: Disk` property. This mechanism is called dependency injection and is particularly useful in unit testing. You can read more about it [here](../../architecture/architecture-overview.md)

## Client Side

On the client side, downloading the profile image is handled in the `ProfileHeader.tsx` and `requests/profile.ts` files.

Open the latter and implement the `updateProfile` function.

```typescript
import axios from 'axios';

export async function updateProfile(username: string, avatar: File|null): Promise<void> {
  const formData = new FormData();
  formData.set('name', username);
  if (avatar) {
    formData.set('avatar', avatar);
  }

  await axios.post('/api/profile', formData, {
    headers: {
    'content-type': 'multipart/form-data'
    }
  });
}
```

Now, if you go back to [http://localhost:3000/profile](http://localhost:3000/profile), you should be able to upload your profile picture.
