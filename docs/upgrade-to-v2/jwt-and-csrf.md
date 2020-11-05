# JWT hooks and CSRF protection

## Configuration

The configuration `settings.jwt.secretOrPublicKey` has been removed. Use `settings.jwt.secret` or `settings.jwt.publicKey` instead.

The configuration `settings.jwt.cookieName` has been renamed to `settings.jwt.cookie.name`.

## CSRF protection

The package `@foal/csrf` has been removed. In version 2, the CSRF protection is directly included in the JWT hooks and can be enabled with `settings.jwt.csrf.enabled` (the configuration key `settings.csrf.enabled` has been removed).

```
npm uninstall @foal/csrf
```

There is no need anymore to provide a CSRF secret.

There is no need anymore to set manually the value of the `sameSite` cookie attribute in the config.

There is no need anymore to specify an expire time for the CSRF cookie. 

All of this is now managed by the framework.

The best way to use the new CSRF protection is to go directly to the [CSRF page](./../security/csrf-protection.md).

## New features

### JWT cookies

The JWT package has two new functions `setAuthCookie` and `removeAuthCookie` to manage JWT with cookies.

### Read secrets and private/public keys

Secrets and private/public keys can be read from the configuration with the two new functions `getSecretOrPrivateKey` and `getSecretOrPublicKey`. 

Encoded secrets with the configuration key `settings.jwt.secretEncoding` are supported.
