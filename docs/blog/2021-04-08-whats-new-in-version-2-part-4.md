---
title: What's new in version 2 (part 4/4)
author: Loïc Poullain
author_title: Creator of FoalTS. Software engineer.
author_url: https://loicpoullain.com
author_image_url: https://avatars1.githubusercontent.com/u/13604533?v=4
image: blog/twitter-banners/whats-new-in-version-2-part-4.png
tags: [release]
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

![Banner](./assets/whats-new-in-version-2-part-4/banner.png)

This article presents the improvements to the session system in FoalTS version 2.

The new syntax can be used either with cookies or with the `Authorization` header. It adds the following new features:
- query all sessions of a given user
- query all connected users
- force logout of a specific user
- flash sessions
- session ID regeneration
- anonymous and authenticated sessions

FoalTS also simplifies stateful CSRF protection so that all it takes is one setting to enable it.

<!--truncate-->

> This article is the part 4 of the series of articles *What's new in version 2.0*. Part 3 can be found [here](./2021-03-11-whats-new-in-version-2-part-3.md).

## New Session System

The new authentication system is probably the main new feature of version 2. The old session components have been redesigned so as to serve three purposes:
- be easy to use with very little code,
- support a large variety of applications and architectures (SPA, Mobile, SSR, API, `Authorization` header, cookies, serverless environment, social auth, etc),
- and add missing features impossible to implement in version 1.

Here is the way to use it:
- First [specify in the configuration](/docs/authentication/session-tokens#choosing-a-session-store) where your sessions should be stored (SQL database, redis, Mongo, etc).
- Then decorate any route or controller that need authentication with `@UseSessions`.

### Example with the `Authorization` header

In this first example, we'd like to use the `Authorization` header to handle authentication.

We want to send an email address and password to `/login` and retrieve a token in return to authenticate further requests.

```typescript
import { dependency, Context, Get, HttpResponseOK, UserRequired, UseSessions, ValidateBody, HttpResponseUnauthorized, Post } from '@foal/core';
import { fetchUser } from '@foal/typeorm';

import { User, Product } from '../entities';

@UseSessions({
  user: fetchUser(User)
})
export class ApiController {
  @dependency
  store: Store;

  @Get('/products')
  @UserRequired()
  async readProducts(ctx: Context<User>) {
    return new HttpResponseOK(Product.find({ user: ctx.user }));
  }

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async login(ctx: Context) {
    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    ctx.session = await createSession(this.store);
    ctx.session.setUser(user);

    return new HttpResponseOK({
      token: ctx.session.getToken()
    });
  }

  @Post('/logout')
  async logout(ctx: Context) {
    if (ctx.session) {
      await ctx.session.destroy();
    }

    return new HttpResponseOK();
  }
}
```

### Example with cookies

In this second example, we will use cookies to manage authentication. Foal will auto-creates a session when none exists.

```typescript
import { dependency, Context, Get, HttpResponseOK, UserRequired, UseSessions, ValidateBody, HttpResponseUnauthorized, Post } from '@foal/core';
import { fetchUser } from '@foal/typeorm';

import { User, Product } from '../entities';

@UseSessions({
  // highlight-next-line
  cookie: true,
  user: fetchUser(User)
})
export class ApiController {
  @dependency
  store: Store;

  @Get('/products')
  @UserRequired()
  async readProducts(ctx: Context<User>) {
    return new HttpResponseOK(Product.find({ user: ctx.user }));
  }

  @Post('/login')
  @ValidateBody({
    additionalProperties: false,
    properties: {
      email: { type: 'string', format: 'email' },
      password: { type: 'string' }
    },
    required: [ 'email', 'password' ],
    type: 'object',
  })
  async login(ctx: Context) {
    const user = await User.findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    // highlight-next-line
    ctx.session.setUser(user);

    // highlight-next-line
    return new HttpResponseOK();
  }

  @Post('/logout')
  async logout(ctx: Context) {
    if (ctx.session) {
      await ctx.session.destroy();
    }

    return new HttpResponseOK();
  }
}
```

### New features

In addition to this redesign, version 2 also offers new features.

#### Query all sessions of a user (TypeORM only)

This feature allows you to list all sessions associated with a specific user. This can be useful if a user is connected on several devices and you like to audit them.

```typescript
const user = { id: 1 };
const ids = await store.getSessionIDsOf(user);
```

#### Query all connected users (TypeORM only)

This feature lists all users that have at least one session in the database.

```typescript
const ids = await store.getAuthenticatedUserIds();
```

#### Force the disconnection of a user (TypeORM only)

In case you want to remove all sessions associated with a specific user, you can use the `destroyAllSessionsOf` method. This can be useful if you think a session has been corrupted or when you want, for example when a password is changed, to disconnect a user from all other devices to which he/she has previously logged on.

```typescript
const user = { id: 1 };
await store.destroyAllSessionsOf(user);
```

#### Flash sessions

Flash content is used when we want to save data (a message for example) only for the next request. A typical use case is when a user enters wrong credentials. The page is refreshed and an error message is displayed.

To use flash content, you only need to add the option `flash` set to `true` in the `set` method.

```typescript
ctx.session.set('error', 'Incorrect email or password', { flash: true });
```

#### Regenerate the session ID

Regenerating the session ID is a [recommended practice](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html#renew-the-session-id-after-any-privilege-level-change) when changing a user's privileges or password. This can now be done with the `regenerateID` method

```typescript
await ctx.session.regenerateID();
```

#### Expired sessions clean up regularly (TypeORM and MongoDB)

Starting from version 2, Foal regularly cleanup expired sessions in your database so you don't have to do it manually.

#### Anonymous sessions and templates

In version 2, `@UseSessions({ cookie: true })` automatically creates a session if none exists. This is particularly useful if you're building a shopping website with SSR templates. When the user navigates on the website, he/she can add items to the cart without having to log in the first place. Then, when the user wants to place his/her order, he can log in and the only thing you have to do is this:

```typescript
ctx.session.setUser(user)
```

## Stateful CSRF protection simplified

In version 1, providing a CSRF protection was quite complex. We needed to manage token generation, handle the CSRF cookie (expiration, etc), use an additional hook, etc.

Starting from version 2, the CSRF protection is all managed by `@UseSessions`.


<Tabs
  groupId="config"
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  session:
    csrf:
      enabled: true
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "session": {
      "csrf": {
        "enabled": true
      }
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    session: {
      csrf: {
        enabled: true
      }
    }
  }
}
```

</TabItem>
</Tabs>

When it is enabled, an additional `XSRF-TOKEN` cookie is sent to the client at the same time as the session cookie. It contains a CSRF token associated with your session.

When a request is made to the server, the `@UseSessions` hooks expects you to include its value in the `XSRF-TOKEN` header.

> If you're building a regular web application and want to include the CSRF token in your templates, you can retrieve it with this statement: `ctx.session.get('csrfToken')`.