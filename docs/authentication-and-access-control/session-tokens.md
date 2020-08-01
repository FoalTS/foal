# Session Tokens

## Introduction

> This document assumes that you have alread read the [Quick Start](./quick-start.md) page.

In FoalTS, web sessions are temporary states associated with a specific user. They are identified by a token and are mainly used to keep users authenticated between several HTTP requests (the client sends the token on each request to authenticate the user).

A session usually begins when the user logs in and ends after a period of inactivity or when the user logs out. By inactivity, we mean that the server no longer receives requests from the authenticated user for a certain period of time.

## Get Started

> warning: version 2 -> add the migrations

### Choose a Session Store

Then you have to choose where the temporary session state will be stored. FoalTS provides several *session stores* for this. For example, you can use the `TypeORMStore` to save the sessions in your SQL database or the `RedisStore` to save them in a redis cache.

These session stores are services and can therefore be injected into your controllers and services as such:

```typescript
export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/login')
  // ...
  login() {
    // ...
    const store = this.store;
  }
}
```

### Create the Session and Get the Token (Log In)

Sessions are created using the method `createAndSaveSession` of the session store.

```typescript
const session = await store.createAndSaveSession({ userId: user.id });
```

At login time, the user is usually retrieved upstream when checking credentials.

The session token then can be read with the method `getToken()` to send it back to the client. This token identifies the session.

```typescript
const token = session.getToken();
```

### Use the Session Token to Retrieve the Session

On each subsequent request, the client must send this token in order to retrieve the session and authenticate the user. It must be included in the `Authorization` header using the bearer scheme (unless you use cookies, see section below).

```
Authorization: Bearer my-session-token
```

The hooks `@TokenRequired` and `@TokenOptional` will then check the token and retrieve the associated session and user.

```typescript
import { Context, Get, HttpResponseOK, TokenRequired } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

@TokenRequired({ store: TypeORMStore })
class ApiController {

  @Get('/products')
  readProducts(ctx: Context) {
    // ctx.user and ctx.session are defined.
    return new HttpResponseOK();
  }

}
```

If the header `Authorization` is not found or does not use the `bearer` scheme, the hook `@TokenRequired` returns an error *400 - BAD REQUEST*. The `@TokenOptional` hook does nothing.

If the token is present and not valid or if the associated session has expired, both hooks return an error *401 - UNAUTHORIZED*.

In other cases, the hooks retrieve the session from the store and assign it to the `Context.session` property. As for the session user ID, it is assigned to `Context.user`.

If you want the `ctx.user` to be an object or an instance of the `User` class, you must pass to the hook `user` option a function whose signature is:

```typescript
(id: string|number) => Promise<any|undefined>
```

The hooks will assign the value it returns to `ctx.user`.

For example, you can use the `fetchUser` function to retrieve the user from the database:

```typescript
import { Context, Get, HttpResponseOK, TokenRequired } from '@foal/core';
import { fetchUser, TypeORMStore } from '@foal/typeorm';

import { User } from '../entities';

@TokenRequired({
  store: TypeORMStore,
  user: fetchUser(User)
})
class ApiController {

  @Get('/products')
  readProducts(ctx: Context) {
    // ctx.user is an instance of User
    return new HttpResponseOK();
  }

}
```

*Note: The hooks `@TokenRequired` and `@TokenOptional` are responsible for extending the session life each time a request is received.*

>Alternatively, you can also manually verify a session token and read its associated session. The code below shows how to do so.
>
> ```typescript
> const token = // ...
> const session = await store.read(token);
> if (!session) {
>   throw new Error('Session does not exist or has expired.')
> }
> const userId = session.get('userId');
> ```

### Destroy the Session (Log Out)

> warning: version 2

Sessions are can be destroyed (i.e users can be logged out) using their `destroy` method.

```typescript
import { Context, dependency, HttpResponseNoContent, TokenOptional } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';

export class AuthController {
  @dependency
  store: TypeORMStore;

  @Post('/logout')
  @TokenOptional({ store: TypeORMStore })
  async logout(ctx: Context) {
    if (ctx.session) {
      await ctx.session.destroy();
    }
    return new HttpResponseNoContent();
  }

}
```

## Usage with Cookies

> Be aware that if you use cookies, your application must provide a [CSRF defense](../security/csrf-protection.md).

FoalTS sessions can also be used with cookies. The hook `cookie` option and the `setSessionCookie` and `removeSessionCookie` funtions are dedicated to this use.

```typescript
import { HttpResponseOK, Post, removeSessionCookie, setSessionCookie, TokenRequired } from '@foal/core';

export class AuthController {

  @Post('/login')
  // ...
  login() {
    // ...
    const response = new HttpResponseOK();
    setSessionCookie(response, session.getToken());
    return response;
  }

  @Post('/logout')
  // ...
  logout() {
    // ...
    const response = new HttpResponseOK();
    removeSessionCookie(response);
    return response;
  }

}

@TokenRequired({ store: MyStore, cookie: true })
export class ApiController {

}
```

The cookie default directives can be override in the configuration.

*Example with config/default.yml*
```yaml
settings:
  session:
    cookie:
      name: xxx
      domain: example.com
      httpOnly: false # default: true
      path: /foo # default: /
      sameSite: lax
      secure: true
```

Instead of having 400 and 401 HTTP errors, you can also define redirections.

```typescript
@TokenRequired({
  store: TypeORMStore,
  cookie: true;
  redirectTo: '/login'
})
export class PageController {
  // ...
}
```

## Specify the Name of the Session Store in the Configuration

In order to avoid duplicates, the name of the session package can also be provided in the configuration.

```json
{
  "settings": {
    "session": {
      "store": "@foal/typeorm"
    }
  }
}
```

```typescript
export class Controller {

  @dependency
  store: SessionStore;

  // ...
  login() {
    // this.store.createAndSaveSession(...)
  }

  // ...
  @TokenRequired()
  protectedRoute() {

  }

}
```

> The configuration also supports relative paths. See [abstract services](../architecture/services-and-dependency-injection.md#abstract-services).

## Update the Session Content

When receiving an HTTP request, the hooks `@TokenRequired` and `@TokenOptional` convert the session token (if it exists and is valid) into a `Session` instance retrieved from the session store. This object is assigned to the `Context.session` property and is accessible in the remaining hooks and in the controller method.

You can access and modify the session content with the `set` and `get` methods.

```typescript
import { Context, HttpResponseNoContent, Post, Session, TokenRequired } from '@foal/core';

@TokenRequired(/* ... */)
export class ApiController {

  @Post('/subscribe')
  purchase(ctx: Context<any, Session>) {
    const plan = ctx.session.get<string>('plan', 'free');
    // ...
  }

  @Post('/choose-premium-plan')
  addToCart(ctx: Context<any, Session>) {
    ctx.session.set('plan', 'premium');
    return new HttpResponseNoContent();
  }
}
```

## Session Expiration Timeouts

Session states are by definition temporary. They have two expiration timeouts.

The first one is the inactivity (or idle) timeout. If the session is not updated or its lifetime is not extended, the session is destroyed. The `@TokenRequired` and `@TokenOptional` take care of extending the session lifetime on each request. Its default value is 15 minutes.

The second is the absolute timeout. Whatever the activity is, the session will expire after a fixed period of time. The default value is one week.

These values can be override with the [configuration keys](../deployment-and-environments/configuration.md) `settings.session.expirationTimeouts.inactivity` and `settings.session.expirationTimeouts.absolute`. The time periods must be specified in seconds.

*Example with config/default.yml*
```yaml
settings:
  session:
    secret: xxx
    expirationTimeouts:
      absolute: 2592000 # 30 days
      inactivity: 1800 # 30 min
```

*Example with .env*
```
SETTINGS_SESSION_EXPIRATION_TIMEOUTS_ABSOLUTE=2592000
SETTINGS_SESSION_EXPIRATION_TIMEOUTS_INACTIVITY=1800
```

## Revoking Sessions

Sessions can be revoked (i.e. destroyed) using the methods `destroy` and `clear` of the session stores. The examples below show how to use these methods in *shell scripts*.

### Revoking One Session

Create a new file named `src/scripts/revoke-session.ts`.

```typescript
import { createService, Session } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { createConnection } from 'typeorm';

export const schema = {
  type: 'object',
  properties: {
    token: { type: 'string' },
  },
  required: [ 'token' ]
}

export async function main(args: { token: string }) {
  await createConnection();

  const store = createService(TypeORMStore); // OR MongoDBStore, RedisStore, etc
  await store.destroy(args.token);
}
```

Build the script.

> warning: version 2

```
npm run build
```

Run the script.

```
foal run revoke-session token="xxx.yyy"
foal run revoke-session sessionID="xxx"
```

### Revoking All Sessions

Create a new file named `src/scripts/revoke-all-sessions.ts`.

```typescript
import { createService } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { createConnection } from 'typeorm';

export async function main() {
  await createConnection();

  const store = createService(TypeORMStore); // OR MongoDBStore, RedisStore, etc
  await store.clear();
}
```

Build the script.

> warning: version 2

```
npm run build
```

Run the script.

```
foal run revoke-all-sessions
```

## Specifying Globally the Session Store

> Available in Foal v1.11.0 onwards.

In order to avoid passing the session store to the hooks each time, you can provide it via the configuration.

*default.yml*
```yaml
settings:
  session:
    store: '@foal/typeorm' # or '@foal/mongodb' or '@foal/redis'
```

```typescript
// Before
@TokenRequired({ store: TypeORMStore })
export class ApiController {
  // ...
}

// After
@TokenRequired()
export class ApiController {
  // ...
}
```

## Query All Sessions of a Given User

> *This feature is only available with the TypeORM store.*

```typescript
const user = { id: 1 };
const sessions = await this.store.getSessionsOf(user);
```

## Query All Connected Users

> *This feature is only available with the TypeORM store.*

```typescript
const ids = await this.store.getAuthenticatedUserIds();
```

## Force the Disconnection of a Given User

> *This feature is only available with the TypeORM store.*

```typescript
const user = { id: 1 };
await this.store.destroyAllSessionsOf(user);
```

## Flash Sessions

Sometimes we may wish to store items in the session only for the next request.

For example, when users enter incorrect credentials, they are redirected to the login page, and this time we may want to render the page with a specific message that says "Incorrect email or password". If the user refreshes the page, the message then disappears.

This can be done with flash content. The data will only be available on the next request.

```typescript
ctx.session.set('error', 'Incorrect email or password', { flash: true });
```

## Session Stores

FoalTS currently offers three built-in session stores: `TypeORMStore`, `MongoDBStore` `RedisStore`. Others will come in the future. If you need a specific one, you can submit a Github issue or even create your own store (see section below).

### TypeORMStore (SQL Databases: Postgres, MySQL, SQLite, etc)

```
npm install typeorm @foal/typeorm
```

This store uses the default TypeORM connection which is usually specified in `ormconfig.{json|yml|js}`. This means that session states are saved in your SQL database (using the table `foal_session`).

Due to the nature of SQL databases, not all expired sessions are deleted by default (we cannot define a time period after which a SQL row must be deleted). However, the session store provides us with a `cleanUpExpiredSessions` function to manually delete all expired sessions. It is recommended to periodically call this method using, for example, a shell script.

*src/scripts/clean-up-expired-sessions.ts*
```typescript
import { createService } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { createConnection } from 'typeorm';

export async function main() {
  await createConnection();

  const store = createService(TypeORMStore);
  await store.cleanUpExpiredSessions();
}
```

Build the script.

> warning: version 2

```
npm run build
```

Run the script.

```
foal run clean-up-expired-sessions
```

### RedisStore

```
npm install @foal/redis
```

In order to use this store, you must provide the redis URI in either:
- a configuration file

    *Example with config/default.yml*
    ```yaml
    redis:
      uri: 'redis://localhost:6379'
    ```
- or in a `.env` file or in an environment variable:
    ```
    REDIS_URI=redis://localhost:6379
    ```

### MongoDBStore

```
npm install @foal/mongodb
```

This store saves your session states in a MongoDB database (using the collection `foalSessions`). In order to use it, you must provide the MongoDB URI in either:
- a configuration file

    *Example with config/default.yml*
    ```yaml
    mongodb:
      uri: 'mongodb://localhost:27017'
    ```
- or in a `.env` file or in an environment variable:
    ```
    MONGODB_URI=mongodb://localhost:27017
    ```

Due to the nature of MongoDB databases, not all expired sessions are deleted by default (we cannot define a time period after which a document must be deleted). However, the session store provides us with a `cleanUpExpiredSessions` function to manually delete all expired sessions. It is recommended to periodically call this method using, for example, a shell script.

*src/scripts/clean-up-expired-sessions.ts*
```typescript
import { createService } from '@foal/core';
import { MongoDBStore } from '@foal/mongodb';

export async function main() {
  const store = createService(MongoDBStore);
  await store.cleanUpExpiredSessions();
}
```

Build the script.

> warning: version 2

```
npm run build
```

Run the script.

```
foal run clean-up-expired-sessions
```

### Custom Store

If necessary, you can also create your own session store. This one must inherit the abstract class `SessionStore`.

```typescript
import { Session, SessionOptions } from '@foal/core';

class CustomSessionStore extends SessionStore {
  createAndSaveSession(sessionContent: any, options?: SessionOptions | undefined): Promise<Session> {
    throw new Error('Method not implemented.');
  }
  update(session: Session): Promise<void> {
    throw new Error('Method not implemented.');
  }
  destroy(sessionID: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  read(sessionID: string): Promise<Session | undefined> {
    throw new Error('Method not implemented.');
  }
  clear(): Promise<void> {
    throw new Error('Method not implemented.');
  }
  cleanUpExpiredSessions(): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
```

Here is the description of each method:

- **createAndSaveSession**: Create and save a new session.

    This method *MUST* call the `generateSessionID` method to generate the session ID.

    This method *MUST* call the `applySessionOptions` method to extend the sessionContent.


- **update**: Update and extend the lifetime of a session.

  Depending on the implementation, the internal behavior can be similar to "update" or "upsert".

- **destroy**: Delete a session, whether it exists or not.
- **read**: Read a session from its ID.

    Return `undefined` if the session does not exist or has expired. 

- **clear**: Clear all sessions.

- **cleanUpExpiredSessions**: Some session stores may need to run periodically background jobs to cleanup expired sessions. This method deletes all expired sessions.