---
title: Session Tokens & CSRF Protection
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The main feature of FoalTS version 2 is the new session management. The new authentication system is intended to be more intuitive and to require less code and configuration. It also offers new functionalities.

> Note that when upgrading to version 2, all your users will be automatically logged out.

## Overview

Previously, we had to manage a lot of functions and hooks to authenticate users in FoalTS: `@TokenRequired`, `@TokenOptional`, `removeSessionCookie`, `setSessionCookie`, `getCsrfToken`, `@CsrfTokenRequired`, `setCsrfCookie`.

Starting with version 2, they have all been removed and replaced with two unique hooks: `@UseSessions` and `@UserRequired`.

There is also no need for a session secret anymore. The config parameter `settings.session.secret` can therefore be removed.

## Session Tokens

### Choosing and Configuring the Session Store

#### Specify the Store in The Configuration

Since v1.11.0, FoalTS allows you to globally specify in the configuration which session store to use. This is now the recommended approach and it is assumed that you use it in all examples in the documentation.

To specify the store globally, replace all references to `TypeORMStore` (or redis, mongo, etc) with `Store` and remove the `store: TypeORMStore` option from your hooks.

*Example*
```typescript
import { Store } from '@foal/core';

class AppController {
  // Before
  @dependency
  store: TypeORMStore;

  // After
  @dependency
  store: Store;


  @Get('/products')
  // Before
  @TokenRequired({ store: TypeStore })
  // After
  @TokenRequired()
  readProducts() {
    // ...
  }

}
```

Then, in the configuration, specify the package name of your session store (`@foal/typeorm`, `@foal/redis`, etc).

<Tabs
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
    store: "@foal/typeorm"
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "session": {
      "store": "@foal/typeorm",
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
      store: "@foal/typeorm",
    }
  }
}
```

</TabItem>
</Tabs>

#### TypeORM Store

**Warning:** Starting from version 2, `TypeORMStore` only support numbers (not strings) as user IDs.

In version 1, when launching the application, Foal was making a request to the database to create the session table if it does not exist.

This had two drawbacks:
- This may make too many undesirable requests to the database in a severless environment.
- The database schema is updated at runtime outside the classical migration process. This practice can be dangerous and it does not allow to keep a traceability of the modifications of the database schema unlike migrations (revert, etc).

Starting from version 2, **you must generate and run migrations yourself** to create the session table.

The easier way to achieve this is probably to export the `DatabaseSession` entity from `@foal/typeorm` and to run the following commands.

*user.entity.ts*
```typescript
// ...

@Entity()
export class User extends BaseEntity {

}

export { DatabaseSession } from '@foal/typeorm';
```

```bash
npm run makemigrations
npm run migrations
```

> Once you application is migrated to version 2 and works as expected, you will be able to *manually* delete the old `foal_session` table. The new table used by the framework is named `database_session`.

#### Redis Store

The configuration key `redis.uri` has been renamed to `settings.redis.uri`.

See also [this](./config-system.md#environment-variables).

> *Note: In the Redis database, session keys now start with `sessions:` instead of `session:`*.

#### MongoDB Store

The configuration key `mongodb.uri` has been renamed to `settings.mongodb.uri`.

See also [this](./config-system.md#environment-variables).

> Once you application is migrated to version 2 and works as expected, you will be able to manually delete the old `foalSessions` collection. The new collection used by the framework is named `sessions`.

#### Custom Store

Due to the complexity of implementing a store in version 1, it is unlikely that one has been implemented.

However, if it has, the best way to upgrade it to version 2 is to rewrite it from scratch using the documentation.


### New Login

> *You may be interested in looking at the [quick start page](../authentication-and-access-control/session-tokens.md) as well.*

#### Example with the `Authorization` header

*Before*
```typescript
export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const session = await this.store.createAndSaveSessionFromUser(user);
    return new HttpResponseOK({
      token: session.getToken()
    });
  }
}
```

*After*
```typescript
import { UseSessions, Store } from '@foal/core';

@UseSessions()
export class AuthController {
  @dependency
  store: Store;

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

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
}
```

#### Example with cookies

*Before*
```typescript
export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseNoContent();
    const token = session.getToken();
    setSessionCookie(response, token);
    return response;
  }
}
```

*After*
```typescript
import { UseSessions, Store } from '@foal/core';

@UseSessions({
  cookie: true,
  // user: fetchUser(User)
})
export class AuthController {
  // This line is required: the store must be injected in at least one controller.
  @dependency
  store: Store;

  @Post('/login')
  @ValidateBody(credentialsSchema)
  async login(ctx: Context<any, Session>) {
    const user = await getRepository(User).findOne({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    ctx.session.setUser(user);

    return new HttpResponseOK();
  }

}
```

### New Logout

> *You may be interested in looking at the [quick start page](../authentication-and-access-control/session-tokens.md) as well.*

In version 2, you don't need to talk directly to the store, use weird options (such as `extendLifeTimeOrUpdate`) or manage cookies yourself.

Just call `session.destroy()` and FoalTS will take care of everything else.

#### Example with the `Authorization` header

**Before**
```typescript
export class AuthController {

  @dependency
  store: TypeORMStore;

  @Post('/logout')
  @TokenRequired({
    extendLifeTimeOrUpdate: false,
    store: TypeORMStore,
  })
  async logout(ctx: Context<any, Session>) {
    await this.store.destroy(ctx.session.sessionID);

    return new HttpResponseNoContent();
  }

}
```

**After**
```typescript
export class AuthController {

  @Post('/logout')
  @UseSessions()
  async logout(ctx: Context) {
    if (ctx.session) {
      await ctx.session.destroy();
    }

    return new HttpResponseNoContent();
  }

}
```

#### Example with cookies

**Before**
```typescript
export class AuthController {

  @dependency
  store: TypeORMStore;

  @Post('/logout')
  @TokenRequired({
    cookie: true,
    extendLifeTimeOrUpdate: false,
    store: TypeORMStore,
  })
  async logout(ctx: Context<any, Session>) {
    await this.store.destroy(ctx.session.sessionID);

    const response = new HttpResponseNoContent();
    removeSessionCookie(response);
    return response;
  }

}
```

**After**
```typescript
export class AuthController {

  @Post('/logout')
  @UseSessions({
    cookie: true,
  })
  async logout(ctx: Context) {
    if (ctx.session) {
      await ctx.session.destroy();
    }

    return new HttpResponseNoContent();
  }

}
```

### Access Control

> *You may be interested in looking at the [quick start page](../authentication-and-access-control/session-tokens.md) as well.*

#### Example with the `Authorization` header

*Before*
```typescript
@TokenRequired({ store: TypeORMStore, user: fetchUser(User) })
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

*After*
```typescript
// The `request` option returns a pretty message if the Authorization header is not here.
@UseSessions({
  required: true,
  user: fetchUser(User)
})
@UserRequired()
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

#### Example with cookies

*Before*
```typescript
@TokenRequired({ store: TypeORMStore, cookie: true, user: fetchUser(User) })
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

*After*
```typescript
@UseSessions({
  cookie: true,
  user: fetchUser(User)
})
@UserRequired()
export class ApiController {
  @Get('/products')
  readProducts() {
    return new HttpResponseOK([]);
  }
}
```

### Send the CSRF token in a template

```typescript
// Before
return render('templates/home.html', { csrfToken: await getCsrfToken(ctx.session) });

// After
return render('templates/home.html', { csrfToken: ctx.session.get('csrfToken') });
```

### Read or create a session

To read or create a session manually, use the function `createSession` and `readSession` instead of the store directly.

`Session.verifyTokenAndGetId(token)` is removed. 

### Revoking sessions

See [session tokens](../authentication-and-access-control/session-tokens.md)

### Breaking Changes that Should not Affect You

If you are affected, it's probably you do not use the component the right way.

- The Session constructor has changes. You should not instantiate it yourself. Use `readSession` or `createSession` instead.
- Except for the `get` and `set` methods, the interface of `Session` has changed.
- The methods `getRedisInstance` and `getMongoInstance` have been removed from the stores.

## CSRF Protection

```
npm uninstall @foal/csrf
```

The package `@foal/csrf` has been removed. In version 2, the CSRF protection is directly included in the `@UseSessions` hook and can be enabled with `settings.session.csrf.enabled` (the configuration key `settings.csrf.enabled` does not exist anymore).

You do not need to take care of generating a CSRF token in the session. The framework handles it for you.

The best way to use the new CSRF protection is to go directly to the [CSRF page](./../security/csrf-protection.md).

**Warning:** In order to _work better_ with some popular frontend frameworks, the default name of the CSRF cookie has been changed from `csrfToken` to `XSRF-TOKEN`.

## New Features

### Session Tokens

#### Query all sessions of a user (TypeORM only)

See [session tokens](../authentication-and-access-control/session-tokens.md)

#### Query all connected users (TypeORM only)

See [session tokens](../authentication-and-access-control/session-tokens.md)

#### Force the disconnection of a user (TypeORM only)

See [session tokens](../authentication-and-access-control/session-tokens.md)

#### Flash sessions

See [session tokens](../authentication-and-access-control/session-tokens.md)

#### Regenerate the session ID

See [session tokens](../authentication-and-access-control/session-tokens.md)

#### Expired sessions clean up regularly (TypeORM and MongoDB)

See [session tokens](../authentication-and-access-control/session-tokens.md)

#### Anonymous sessions and templates

See [session tokens](../authentication-and-access-control/session-tokens.md)