---
title: Social Auth with Google
id: tuto-15-social-auth
slug: 15-social-auth
---

In this last part of the tutorial, we will give users the ability to log in with Google. Currently, they can only log in with an email and a password.

To do this, you will use Foal's social authentication system.

> *This section assumes that you have already set up a Google application and have retrieved your client ID and secret. If you have not, you might want to check this [page](../../authentication/social-auth.md) first. The redirection URIs allowed in your Google application must include `http://localhost:3001/api/auth/google/callback`.*

## Nullable Passwords

The first step is to update the `User` model. Some users may only use the social login and therefore not have a password. To take this into account, we will make the `password` column accept null values.

Open `user.entity.ts` and update its contents.

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

}

export { DatabaseSession } from '@foal/typeorm';
```

Make and run the migrations.

```bash
npm run makemigrations
npm run migrations
```

Then open `auth.controller.ts` and add a condition to check whether the password value is `null` in the database.

```typescript
if (!user.password) {
  return new HttpResponseUnauthorized();
}

if (!(await verifyPassword(password, user.password))) {
  return new HttpResponseUnauthorized();
}
```

## Configuration

Now that the password problem is solved, you can install the packages and provide your social credentials in the configuration.

```bash
npm install @foal/social
```

*config/default.json*
```json
{
  "port": "env(PORT)",
  "settings": {
    ...
    "social": {
      "google": {
        "clientId": "env(GOOGLE_CLIENT_ID)",
        "clientSecret": "env(GOOGLE_CLIENT_SECRET)",
        "redirectUri": "http://localhost:3001/api/auth/google/callback"
      }
    },
  },
  ...
}
```

*.env*
```bash
# ...

GOOGLE_CLIENT_ID="your Google client ID"
GOOGLE_CLIENT_SECRET="your Google client secret"
```

## The Social Controller

Create the controller.

```bash
npx foal generate controller api/social-auth --register
```

Open the file and add two new routes.

| API endpoint | Method | Description |
| --- | --- | --- |
| `/api/auth/google` | `POST` | Redirects the user to Google login page. |
| `/api/auth/google/callback` | `GET` | Handles redirection from Google once the user has approved the connection. |

```typescript
import { Context, dependency, Get, HttpResponseRedirect } from '@foal/core';
import { GoogleProvider } from '@foal/social';
import { User } from '../../entities';
import { Disk } from '@foal/storage';

export class SocialAuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  disk: Disk;

  @Get('/google')
  redirectToGoogle() {
    return this.google.createHttpResponseWithConsentPageUrl({ isRedirection: true });
  }

  @Get('/google/callback')
  async handleGoogleRedirection(ctx: Context<User>) {
    const { userInfo } = await this.google.getUserInfo(ctx);

    if (!userInfo.email) {
      throw new Error('Google should have returned an email address.');
    }

    let user = await User.findOneBy({ email: userInfo.email });

    if (!user) {
      user = new User();
      user.email = userInfo.email;
      user.avatar = '';
      user.name = userInfo.name ?? 'Unknown';

      if (userInfo.picture) {
        const response = await fetch(userInfo.picture);
        const { path } = await this.disk.write('images/profiles/uploaded', response.body)
        user.avatar = path;
      }

      await user.save();
    }

    ctx.session!.setUser(user);
    ctx.user = user;

    return new HttpResponseRedirect('/');
  }

}

```

Open `api.controller.ts` and replace the path prefix of the `SocialAuthController` with `/auth`.

```typescript
subControllers = [
  controller('/stories', StoriesController),
  controller('/auth', AuthController),
  controller('/profile', ProfileController),
  controller('/auth', SocialAuthController)
];
```

Go to [http://localhost:3001/login](http://localhost:3001/login) and click on the *Connect with Google* button. You are redirected to the Google login page. Once you have validated the connection, you will be redirected to the home page. If you have a Google profile picture, you will see it on your profile page.

> For this to work, you need to make sure you are using port `3001` to test the social login. This assumes that you created the production build in the previous step of this tutorial. You can't use the React development server here because the redirects won't work with both ports `3000` and `3001`. 

Congratulations! You have reached the end of this tutorial. You can find the complete source code [here](./assets/tutorial-foal-react.zip).