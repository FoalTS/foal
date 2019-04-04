# Authentication with JWT

```
npm install jsonwebtoken @foal/jwt
```

> *JSON Web Token (JWT) is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret (with the HMAC algorithm) or a public/private key pair using RSA or ECDSA.*
>
> Source: https://jwt.io/introduction/


Foal offers a package, named `@foal/jwt`, to manage authentication / authorization with JSON Web Tokens. When the user logs in, a token is generated and sent to the client. Then, each subsequent request must include this JWT, allowing the user to access routes, services, and resources that are permitted with that token. 

# Generate & Provide a Secret

In order to use JWTs, you must provide a secret to *sign* your tokens. If you do not already have your own, you can generate one with the `foal createsecret` command.

```sh
$ foal createsecret
Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=
```

> Alternatively you can use a public/private key pair to sign your tokens. In this case, please refer to the [advanced section](#Advanced) below.

Once the secret is in hand, there are several ways to provide it to the future hooks:

- using the environment variable `SETTINGS_JWT_SECRET_OR_PUBLIC_KEY`,
- in a file named `.env` in the root directory,
  ```
  SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=
  ```
- or in a YAML or JSON file in the `config/` directory.

  *development.yml*
  ```yaml
  settings:
    jwt:
      secretOrPublicKey: "Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="
  ```
  *development.json*
  ```json
  {
    "settings": {
      "jwt": {
        "secretOrPublicKey": "Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="
      }
    }
  }
  ```

> Note that if the production secret is stored in a file, this file should not be committed.

# Generate & Send Temporary Tokens

JSON Web Tokens are generated from JavaScript objects that usually contain information about the user.

The below example shows how to generate a one-hour token using a secret.

```typescript
import { sign } from 'jsonwebtoken';

const token = sign(
  {
    sub: '90485234',
    id: 90485234,
    email: 'mary@foalts.org'
  },
  Config.get<string>('settings.jwt.secretOrPublicKey'),
  { expiresIn: '1h' }
);
```

- The `subject` property (or `sub`) is required when [making a database call to get more user properties](#Make-a-Database-Call-to-Get-More-Properties-of-the-User).
- Each token **should** have an expiration time. Otherwise, the JWT will be valid indefinitely, which will raise security issues.

## Example of a `LoginController`

The below example shows how to implement a login controller with an email and a password.

*login.controller.ts*
```typescript
import {
  Config, Context, HttpResponseOK, HttpResponseUnauthorized,
  Post, ValidateBody, verifyPassword
} from '@foal/core';
import { sign } from 'jsonwebtoken';

import { User } from '../entities';

export class LoginController {

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

    const token = sign(
      { email: user.email },
      Config.get<string>('settings.jwt.secretOrPublicKey'),
      { expiresIn: '1h' }
    );

    return new HttpResponseOK({ token });
  }

}

```

*user.entity.ts*
```typescript
import { encryptPassword } from '@foal/core';
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await encryptPassword(password);
  }

}

```

# Receive & Verify Tokens

Foal provides two hooks to authenticate users upon subsequent requests: `JWTOptional` and `JWTRequired`. They both expect the client to send the JWT in the **Authorization** header using the **Bearer** schema. 

In other words, the content of the header should look like the following:

```
Authorization: Bearer <token>
```

If no token is provided, the `JWTRequired` hook returns an error *400 - BAD REQUEST* while `JWTOptional` does nothing.

If a token is provided and valid, the hooks set the `Context.user` with the decoded payload (default behavior).

*Example*
```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

@JWTRequired()
export class ApiController {

  @Get('/products')
  readProducts(ctx: Context) {
    console.log(ctx.user);
    return new HttpResponseOK([]);
  }

}
```

# Advanced

## Blacklist Tokens

## Make a Database Call to Get More Properties of the User

The `subject` property (or `sub`) is a string that **must** contain the user id. Otherwise the hooks won't be able to authenticate the user. If the id is a number, it must be converted to a string using, for example, the `toString()` method.

// Mongoose
// TypeORM
// Custom

## Store JWTs in a cookie

## Use RSA or ECDSA public/private keys

## Audience, Algorithm and Other Options

The second argument of `JWTOptional` and `JWTRequired` are passed as options to the `verify` function of the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.

## Techniques

### Extend the "session lifetime"


```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired()
class MyController {}

@JWTRequired({ user: fetchUser(User), blackList: isInFile('./blacklist.txt'), cookie: true })
class MyController {}

@JWTRequired({}, { audience: 'foo' })
class MyController {}
```

If `options.cookie` is not defined, they expect the JWT to be included in the `Authorization` header using the `Bearer` schema. Once the token is verified and decoded, `ctx.user` is populated with the payload (by default) or a custom object (see `options.user`).

> FoalTS makes no assumptions about how the JWT is generated and sent / stored to the client. The choice is yours. However, whenever the user wants to access a protected route, the client must send the JWT in the Authorization header using the Bearer schema (or in an cookie if the option is set to true).

# Options

```typescript
export interface JWTOptions {
  user?: (id: string|number) => Promise<any|undefined>;
  blackList?: (token: string) => boolean|Promise<boolean>;
  cookie?: boolean;
}
```

## The `user` option

By default, the value of `ctx.user` is the decoded payload of the JWT. However, you may want to set `ctx.user` with some data fetched from the database.

The `user` option is a function which takes the JWT `subject` as argument (the id of the user) and returns the data to assign to `ctx.user`.

> The `@foal/typeorm` package provides two handy functions `fetchUser(userEntity)` and `fetchUserWithPermissions(userEntity)` to fetch a user from the database.

## The `blacklist` option

The `blacklist` option lets you easily revoke tokens. It is a function that takes a token as parameter and returns `true` if the token is revoked.

> In particular the `isInFile` function provided in the `@foal/core` package may be useful in this case. It lets you create a file with all the revoked tokens.

## The `cookie` option

By default the hooks parse the `Authorization` header. With the option `cookie: true`, the jwt is retreived from the cookie named `auth`.

> You can change the name of the cookie with the env variable `SETTINGS_JWT_COOKIE_NAME` or in `config/default.json` with the `settings.jwt.cookieName` key.


# Hook Errors

| Error | Response Status | Response Body |  `WWW-Authenticate` Response Header
| --- | --- | --- | --- |
| No secret or public key is provided in `default.json` or as environment variable. | 500 | | |
| The `Authorization` header does not exist (only for `JWTRequired`). | 400 | `{ code: 'invalid_request', description: 'Authorization header not found.' }` |
| The auth cookie does not exist (only for `JWTRequired`). | 400 | `{ code: 'invalid_request', description: 'Auth cookie not found.' }` |
| The `Authorization` header does use the Bearer scheme. | 400 | `{ code: 'invalid_request', description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.' }` |
| The token is black listed. | 401 | `{ code: 'invalid_token', description: 'jwt revoked' }` | error="invalid_token", error_description="jwt revoked"
| The token is not a JWT. | 401 | `{ code: 'invalid_token', description: 'jwt malformed' }` | error="invalid_token", error_description="jwt malformed"
| The signature is invalid. | 401 | `{ code: 'invalid_token', description: 'jwt signature' }` | error="invalid_token", error_description="jwt signature"
| The token is expired. | 401 | `{ code: 'invalid_token', description: 'jwt expired' }` | error="invalid_token", error_description="jwt expired"
| The audience is not expected. | 401 | `{ code: 'invalid_token', description: 'jwt audience invalid. expected: xxx' }` | error="invalid_token", error_description="jwt audience invalid. expected: xxx"
| The issuer is not expected. | 401 | `{ code: 'invalid_token', description: 'jwt issuer invalid. expected: xxx' }` | error="invalid_token", error_description="jwt issuer invalid. expected: xxx"
| There is no subject claim and `options.user` is defined. | 401 | `{ code: 'invalid_token', description: 'The token must include a subject which is the id of the user.' }` | error="invalid_token", error_description="The token must include a subject which is the id of the user."
| `options.user` is defined and no user was found from its value (function). | 401 | `{ code: 'invalid_token', description: 'The token subject does not match any user.' }` | error="invalid_token", error_description="The token subject does not match any user."
