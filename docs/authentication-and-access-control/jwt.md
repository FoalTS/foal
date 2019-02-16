# Authentication with JWT

```typescript
@JWTRequired()
class MyController {}

@JWTRequired({ user: fetchUser(User), blackList: isInFile('./blacklist.txt'), cookie: true })
class MyController {}

@JWTRequired({}, { audience: 'foo' })
class MyController {}
```

FoalTS provides two hooks `JWTOptional` and `JWTRequired` to authenticate users with a [JWT](https://jwt.io/introduction/) token.

If `options.cookie` is not defined, they expect the JWT to be included in the `Authorization` header using the `Bearer` schema. Once the token is verified and decoded, `ctx.user` is populated with the payload (by default) or a custom object (see `options.user`).

The content of the header should look like the following:

```
Authorization: Bearer <token>
```

> FoalTS makes no assumptions about how the JWT is generated and sent / stored to the client. The choice is yours. However, whenever the user wants to access a protected route, the client must send the JWT in the Authorization header using the Bearer schema.

# Set Up

You must provide a secret or a public key to the hooks. You have two ways to do that:
- in the `config/default.json` file through the `settings.jwt.secretOrPublicKey` key,
- or with the environment variable `SETTINGS_JWT_SECRET_OR_PUBLIC_KEY`.

*Example (`config/default.json`):*
```json
{
  ...
  "jwt": {
    "secretOrPublicKey": "strong_secret"
  }
}
```

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

# Verify Options

The second argument of `JWTOptional` and `JWTRequired` are passed as options to the `verify` function of the [jsonwebtoken](https://www.npmjs.com/package/jsonwebtoken) library.

# Common Hook Errors

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
