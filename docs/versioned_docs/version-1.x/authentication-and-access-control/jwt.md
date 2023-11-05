---
title: Authentication with JWT
sidebar_label: JSON Web Tokens (authentication)
---

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

> Alternatively you can use a public/private key pair to sign your tokens. In this case, please refer to the [advanced section](#Use-RSA-or-ECDSA-public/private-keys) below.

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
import { Config } from '@foal/core';
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

- The `subject` property (or `sub`) is only required when [making a database call to get more user properties](#Make-a-Database-Call-to-Get-More-User-Properties).
- Each token should have an expiration time. Otherwise, the JWT will be valid indefinitely, which will raise security issues.

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
import { hashPassword } from '@foal/core';
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
    this.password = await hashPassword(password);
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

In the event that a jwt has been stolen by an attacker, the application must be able to revoke the compromised token. This can be done by establishing a *black list*. Revoked tokens are no longer considered valid and the hooks return a 401 error - UNAUTHORIZED when they receive one.

```typescript
import { isInFile } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({ blackList: isInFile('./blacklist.txt') })
export class ApiController {
  // ...
}
```

The `isInFile` function takes a token and returns a boolean specifying if the token is revoked or not.

You can provide your own function (in the case you want to use a cache database for example). This function must have this signature:

```typescript
(token: string) => boolean|Promise<boolean>;
```

## Refresh the tokens

Having a too-long expiration date for JSON Web Tokens is not recommend as it increases exposure to attacks based on token hijacking. If an attacker succeeds in stealing a token with an insufficient expiration date, he/she will have plenty of time to make other attacks and harm your application.

In order to minimize the exposure, it is recommend to set a short expiration date (15 minutes for common applications) to quickly invalidate tokens. In this way, even if a token is stolen, it will quickly become unusable since it will have expired.

One of the disadvantages of having short expiration dates, however, is that users get logged out too often which is not very user-friendly.

One way to get around this problem is to generate and send a new token on each request. The client then saves this new token and uses it on further requests. In this way, if users are inactive more than 15 minutes, they are disconnected. Otherwise, the user will still be connected but the application will use a different token.

The below code shows how to implement this technique with a hook. On each request, the client will receive a new token in the `Authorization` header of the response. Other implementations are still possible (especially if you use cookies).

> _Note that when a new token is generated, the previous one is still valid until its expiration date._

*refresh-jwt.hook.ts (example)*
```typescript
import { Config, Hook, HookDecorator, HttpResponse } from '@foal/core';
import { sign } from 'jsonwebtoken';

export function RefreshJWT(): HookDecorator {
  return Hook(ctx => {
    if (!ctx.user) {
      return;
    }

    return (response: HttpResponse) => {
      const newToken = sign(
        // The below object assumes that ctx.user is
        // the decoded payload (default behavior).
        {
          email: ctx.user.email,
          // id: ctx.user.id,
          // sub: ctx.user.subject,
        },
        Config.get<string>('settings.jwt.secretOrPublicKey'),
        { expiresIn: '15m' }
      );
      response.setHeader('Authorization', newToken);
    };

  });
}
```

*api.controller.ts (example)*
```typescript
@JWTRequired()
@RefreshJWT()
export class ApiController {
  // ...
}
```

## Make a Database Call to Get More User Properties

In several cases, the decoded payload is not sufficient. We may need to fetch extra properties from the database, such as the user permissions for example, or simply want the `Context.user` to a be a model instance instead of a plain object.

In these cases, the two hooks `JWTRequired` and `JWTOptional` offer a `user` option to transform the decoded payload into something else. To do this,

- Each JSON Web Token must have a `subject` property (or `sub`) which is a string containing the user id. If the id is a number, it must be converted to a string using, for example, the `toString()` method.
  ```typescript
  import { Config } from '@foal/core';
  import { sign } from 'jsonwebtoken';

  const token = sign(
    {
      // TypeScript v3.5.1 and v3.5.2 have a bug which makes the compilation fail
      // with the property "sub". This can be fixed by adding "as any" after the object.
      sub: '90485234', // Required
      id: 90485234,
      email: 'mary@foalts.org'
    },
    Config.get<string>('settings.jwt.secretOrPublicKey'),
    { expiresIn: '1h' }
  );
  ```

- The hook must be provided a function that takes a string id (the `subject`) as parameter and returns the value of the `Context.user`. If the function returns `undefined`, the hooks returns an error *401 - UNAUTHORIZED*.

  *Example with TypeORM*
  ```typescript
  import { Context, Get } from '@foal/core';
  import { JWTRequired } from '@foal/jwt';
  import { fetchUser } from '@foal/typeorm';

  import { User } from '../entities';

  // fetchUser fetches the user from the database using the entity User. It returns an instance of User.
  @JWTRequired({ user: fetchUser(User) })
  export class ApiController {
    @Get('/do-something')
    get(ctx: Context) {
      // ctx.user is the instance returned by fetchUser.
      // ...
    }
  }
  ```

  *Example with Mongoose*
  ```typescript
  import { Context, Get } from '@foal/core';
  import { JWTRequired } from '@foal/jwt';
  import { fetchUser } from '@foal/mongoose';

  import { User } from '../models';

  // fetchUser fetches the user from the database using the model User. It returns an instance of User.
  @JWTRequired({ user: fetchUser(User) })
  export class ApiController {
    @Get('/do-something')
    get(ctx: Context) {
      // ctx.user is the instance returned by fetchUser.
      // ...
    }
  }
  ```

  *Example with a custom function*

  ```typescript
  import { Context, Get } from '@foal/core';
  import { JWTRequired } from '@foal/jwt';

  const users = [
    { id: 1, email: 'mary@foalts.org', isAdmin: true },
    { id: 2, email: 'john@foalts.org', isAdmin: false },
  ];

  function getUserById(id: string) {
    return users.find(user => user.id.toString() === id);
  }

  @JWTRequired({ user: getUserById })
  export class ApiController {
    @Get('/do-something')
    get(ctx: Context) {
      // ctx.user is an item of the `users` array.
      // ...
    }
  }
  ```

## Specifying a Different Encoding for Secrets

By default, UTF-8 is used to encode the secret string into bytes when verifying the token. However, you can use another character encoding with the `settings.jwt.secretEncoding` configuration key.

Available encodings are listed [here](https://nodejs.org/api/buffer.html#buffer_buffers_and_character_encodings).

```json
{
  "settings": {
    "jwt": {
      "secretOrPublicKey": "HEwh0TW7w6a5yUwIrpHilUqetAqTFAVSHx2rg6DWNtg=",
      "secretEncoding": "base64",
    }
  }
}
```

## Store JWTs in a cookie

> Be aware that if you use cookies, your application must provide a [CSRF defense](../security/csrf-protection.md).

By default, the hooks expect the token to be sent in the **Authorization** header using the **Bearer** schema. But it is also possible to send the token in a cookie with the `cookie` option.

```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({ cookie: true })
export class ApiController {
  // ...
}
```

In this case, the token must be sent in a cookie named `auth` by default. This name can be changed with the configuration key `settings.jwt.cookieName`:
- using the environment variable `SETTINGS_JWT_COOKIE_NAME`,
- in a file named `.env` in the root directory,
  ```
  SETTINGS_JWT_COOKIE_NAME=custom_name
  ```
- or in a YAML or JSON file in the `config/` directory.

  *development.yml*
  ```yaml
  settings:
    jwt:
      cookieName: "custom_name"
  ```
  *development.json*
  ```json
  {
    "settings": {
      "jwt": {
        "cookieName": "custom_name"
      }
    }
  }
  ```


## Use RSA or ECDSA public/private keys

JWTs can also be signed using a public/private key pair using RSA or ECDSA.

### Provide the Public/Private Key

The name of the private key is arbitrary.

*Example with a `.env` file*
```
SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=my_public_key
JWT_PRIVATE_KEY=my_private_key
```

### Generate Temporary Tokens

*Example*
```typescript
import { Config } from '@foal/core';
import { sign } from 'jsonwebtoken';

const token = sign(
  {
    email: 'john@foalts.org'
  },
  Config.get<string>('jwt.privateKey'),
  { expiresIn: '1h' }
);
```

### Receive & Verify Tokens

*Example with RSA*
```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({}, { algorithm: 'RSA' })
export class ApiController {
  // ...
}

```

## Audience, Issuer and Other Options

The second parameter of `JWTOptional` and `JWTRequired` allows to specify the required audience or issuer as well as other properties. It is passed as options to the `verify` function of the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.

*Example checking the audience*
```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({}, { audience: [ /urn:f[o]{2}/, 'urn:bar' ] })
export class ApiController {
  // ...
}

```

*Example checking the issuer*
```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({}, { issuer: 'foo' })
export class ApiController {
  // ...
}

```

## Retreive a Dynamic Secret Or Public Key

By default `JWTRequired` and `JWTOptional` use the value of the configuration key `settings.jwt.secretOrPublicKey` as a static secret (or public key).

But it is also possible to dynamically retrieve a key to verify the token. To do so, you can specify a function with the below signature to the `secretOrPublicKey` option.

```typescript
(header: any, payload: any) => Promise<string>;
```

*Example*
```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({
  secretOrPublicKey: async (header, payload) => {
    // ...
    return 'my-secret';
  }
})
export class ApiController {
  // ...
}
```

If needed, this function can throw an `InvalidTokenError` to return a 401 error to the client.

*Example*
```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({
  secretOrPublicKey: async (header, payload) => {
    if (header.alg !== 'RS256') {
      throw new InvalidTokenError('invalid algorithm');
    }
    return 'my-secret';
  }
})
export class ApiController {
  // ...
}
```

In the above example, if the algorithm specified in the token is not `RS256`, then the server will respond a `401 - UNAUTHORIZED` error with this content:

```typescript
{
  code: 'invalid_token',
  description: 'invalid algorithm'
}
```

### Retreive a Public Key from a JWKS endpoint

```
npm install @foal/jwks-rsa
```

The `getRSAPublicKeyFromJWKS` allows you to retreive a public key from a JWKS endpoint. It is based on the [`jwks-rsa` library](https://github.com/auth0/node-jwks-rsa).

*Example*
```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({
  secretOrPublicKey: getRSAPublicKeyFromJWKS({
    cache: true,
    cacheMaxEntries: 5, // Default value
    cacheMaxAge: ms('10h'), // Default value
    jwksUri: 'http://localhost:3000/.well-known/jwks.json',
  })
})
export class ApiController {
  // ...
}

```


## Auth0 and AWS Cognito (examples)

```
npm install @foal/jwks-rsa
```

> Auth0 & AWS Cognito are both platforms to manage authentication & authorization.

This section provides examples on how to decode and verify JWTs generated by these platforms (the `id_token`). It assumes that you are already familiar with them.

*Auth0*
```typescript
import { JWTRequired } from '@foal/jwt';

// These lines assume that you provided your DOMAIN and AUDIENCE in either
// an .env file, in environment variables or in one the configuration file 
// in `config/`.
const domain = Config.get('auth0.domain');
const audience = Config.get('auth0.audience');

@JWTRequired({
  secretOrPublicKey: getRSAPublicKeyFromJWKS({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${domain}/.well-known/jwks.json`,
    rateLimit: true,
  })
}, {
  algorithms: [ 'RS256' ],
  audience,
  issuer: `https://${domain}/`,
})
export class ApiController {
  // ...
}

```

*AWS Cognito*
```typescript
import { JWTRequired } from '@foal/jwt';

// These lines assume that you provided your CLIENT_ID, DOMAIN and USER_POOL_ID
// in either an .env file, in environment variables or in one the configuration 
// file in `config/`.
const clientId = Config.get('cognito.clientId');
const domain = Config.get('cognito.domain');
const userPoolId = Config.get('cognito.userPoolId');

@JWTRequired({
  secretOrPublicKey: getRSAPublicKeyFromJWKS({
    cache: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`,
    rateLimit: true,
  })
}, {
  algorithms: [ 'RS256' ],
  audience: clientId,
  issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
})
export class ApiController {
  // ...
}

```

> *Note: The above example does not use a secret for simplicity.*

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
