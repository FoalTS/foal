# JWT \(authentication\)

## Authentication with JWT

```text
npm install jsonwebtoken @foal/jwt
```

> _JSON Web Token \(JWT\) is an open standard \(RFC 7519\) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed. JWTs can be signed using a secret \(with the HMAC algorithm\) or a public/private key pair using RSA or ECDSA._
>
> Source: [https://jwt.io/introduction/](https://jwt.io/introduction/)

Foal offers a package, named `@foal/jwt`, to manage authentication / authorization with JSON Web Tokens. When the user logs in, a token is generated and sent to the client. Then, each subsequent request must include this JWT, allowing the user to access routes, services, and resources that are permitted with that token.

## Generate & Provide a Secret

In order to use JWTs, you must provide a secret to _sign_ your tokens. If you do not already have your own, you can generate one with the `foal createsecret` command.

```bash
$ foal createsecret
Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=
```

> Alternatively you can use a public/private key pair to sign your tokens. In this case, please refer to the [advanced section](jwt.md#Use-RSA-or-ECDSA-public/private-keys) below.

Once the secret is in hand, there are several ways to provide it to the future hooks:

* using the environment variable `SETTINGS_JWT_SECRET_OR_PUBLIC_KEY`,
* in a file named `.env` in the root directory,

  ```text
  SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8=
  ```

* or in a YAML or JSON file in the `config/` directory.

  _development.yml_

  ```yaml
  settings:
    jwt:
      secretOrPublicKey: "Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="
  ```

  _development.json_

  ```javascript
  {
    "settings": {
      "jwt": {
        "secretOrPublicKey": "Ak0WcVcGuOoFuZ4oqF1tgqbW6dIAeSacIN6h7qEyJM8="
      }
    }
  }
  ```

> Note that if the production secret is stored in a file, this file should not be committed.

## Generate & Send Temporary Tokens

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

* The `subject` property \(or `sub`\) is only required when [making a database call to get more user properties](jwt.md#Make-a-Database-Call-to-Get-More-User-Properties).
* Each token should have an expiration time. Otherwise, the JWT will be valid indefinitely, which will raise security issues.

### Example of a `LoginController`

The below example shows how to implement a login controller with an email and a password.

_login.controller.ts_

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

_user.entity.ts_

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

## Receive & Verify Tokens

Foal provides two hooks to authenticate users upon subsequent requests: `JWTOptional` and `JWTRequired`. They both expect the client to send the JWT in the **Authorization** header using the **Bearer** schema.

In other words, the content of the header should look like the following:

```text
Authorization: Bearer <token>
```

If no token is provided, the `JWTRequired` hook returns an error _400 - BAD REQUEST_ while `JWTOptional` does nothing.

If a token is provided and valid, the hooks set the `Context.user` with the decoded payload \(default behavior\).

_Example_

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

## Advanced

### Blacklist Tokens

In the event that a jwt has been stolen by an attacker, the application must be able to revoke the compromised token. This can be done by establishing a _black list_. Revoked tokens are no longer considered valid and the hooks return a 401 error - UNAUTHORIZED when they receive one.

```typescript
import { isInFile } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({ blackList: isInFile('./blacklist.txt') })
export class ApiController {
  // ...
}
```

The `isInFile` function takes a token and returns a boolean specifying if the token is revoked or not.

You can provide your own function \(in the case you want to use a cache database for example\). This function must have this signature:

```typescript
(token: string) => boolean|Promise<boolean>;
```

### Make a Database Call to Get More User Properties

In several cases, the decoded payload is not sufficient. We may need to fetch extra properties from the database, such as the user permissions for example, or simply want the `Context.user` to a be a model instance instead of a plain object.

In these cases, the two hooks `JWTRequired` and `JWTOptional` offer a `user` option to transform the decoded payload into something else. To do this,

* Each JSON Web Token must have a `subject` property \(or `sub`\) which is a string containing the user id. If the id is a number, it must be converted to a string using, for example, the `toString()` method.

  ```typescript
  import { sign } from 'jsonwebtoken';

  const token = sign(
    {
      sub: '90485234', // Required
      id: 90485234,
      email: 'mary@foalts.org'
    },
    Config.get<string>('settings.jwt.secretOrPublicKey'),
    { expiresIn: '1h' }
  );
  ```

* The hook must be provided a function that takes a string id \(the `subject`\) as parameter and returns the value of the `Context.user`. If the function returns `undefined`, the hooks returns an error _401 - UNAUTHORIZED_.

  _Example with TypeORM_

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

  _Example with Mongoose_

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

  _Example with a custom function_

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

### Store JWTs in a cookie

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

* using the environment variable `SETTINGS_JWT_COOKIE_NAME`,
* in a file named `.env` in the root directory,

  ```text
  SETTINGS_JWT_COOKIE_NAME=custom_name
  ```

* or in a YAML or JSON file in the `config/` directory.

  _development.yml_

  ```yaml
  settings:
    jwt:
      cookieName: "custom_name"
  ```

  _development.json_

  \`\`\`json { "settings": { "jwt": { "cookieName": "custom\_name" } } }

### Use RSA or ECDSA public/private keys

JWTs can also be signed using a public/private key pair using RSA or ECDSA.

#### Provide the Public/Private Key

The name of the private key is arbitrary.

_Example with a_ `.env` _file_

```text
SETTINGS_JWT_SECRET_OR_PUBLIC_KEY=my_public_key
JWT_PRIVATE_KEY=my_private_key
```

#### Generate Temporary Tokens

_Example_

```typescript
import { sign } from 'jsonwebtoken';

const token = sign(
  {
    email: 'john@foalts.org'
  },
  Config.get<string>('jwt.privateKey'),
  { expiresIn: '1h' }
);
```

#### Receive & Verify Tokens

_Example with RSA_

```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({}, { algorithm: 'RSA' })
export class ApiController {
  // ...
}
```

### Audience, Issuer and Other Options

The second parameter of `JWTOptional` and `JWTRequired` allows to specify the required audience or issuer as well as other properties. It is passed as options to the `verify` function of the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.

_Example checking the audience_

```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({}, { audience: [ /urn:f[o]{2}/, 'urn:bar' ] })
export class ApiController {
  // ...
}
```

_Example checking the issuer_

```typescript
import { JWTRequired } from '@foal/jwt';

@JWTRequired({}, { issuer: 'foo' })
export class ApiController {
  // ...
}
```

## Hook Errors

| Error | Response Status | Response Body | `WWW-Authenticate` Response Header |
| :--- | :--- | :--- | :--- |
| No secret or public key is provided in `default.json` or as environment variable. | 500 |  |  |
| The `Authorization` header does not exist \(only for `JWTRequired`\). | 400 | `{ code: 'invalid_request', description: 'Authorization header not found.' }` |  |
| The auth cookie does not exist \(only for `JWTRequired`\). | 400 | `{ code: 'invalid_request', description: 'Auth cookie not found.' }` |  |
| The `Authorization` header does use the Bearer scheme. | 400 | `{ code: 'invalid_request', description: 'Expected a bearer token. Scheme is Authorization: Bearer <token>.' }` |  |
| The token is black listed. | 401 | `{ code: 'invalid_token', description: 'jwt revoked' }` | error="invalid\_token", error\_description="jwt revoked" |
| The token is not a JWT. | 401 | `{ code: 'invalid_token', description: 'jwt malformed' }` | error="invalid\_token", error\_description="jwt malformed" |
| The signature is invalid. | 401 | `{ code: 'invalid_token', description: 'jwt signature' }` | error="invalid\_token", error\_description="jwt signature" |
| The token is expired. | 401 | `{ code: 'invalid_token', description: 'jwt expired' }` | error="invalid\_token", error\_description="jwt expired" |
| The audience is not expected. | 401 | `{ code: 'invalid_token', description: 'jwt audience invalid. expected: xxx' }` | error="invalid\_token", error\_description="jwt audience invalid. expected: xxx" |
| The issuer is not expected. | 401 | `{ code: 'invalid_token', description: 'jwt issuer invalid. expected: xxx' }` | error="invalid\_token", error\_description="jwt issuer invalid. expected: xxx" |
| There is no subject claim and `options.user` is defined. | 401 | `{ code: 'invalid_token', description: 'The token must include a subject which is the id of the user.' }` | error="invalid\_token", error\_description="The token must include a subject which is the id of the user." |
| `options.user` is defined and no user was found from its value \(function\). | 401 | `{ code: 'invalid_token', description: 'The token subject does not match any user.' }` | error="invalid\_token", error\_description="The token subject does not match any user." |

