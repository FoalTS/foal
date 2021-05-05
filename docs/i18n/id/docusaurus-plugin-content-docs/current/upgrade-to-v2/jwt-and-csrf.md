---
title: JWT hooks and CSRF protection
---

## Configuration

The configuration `settings.jwt.secretOrPublicKey` has been removed. Use `settings.jwt.secret` or `settings.jwt.publicKey` instead.

The configuration `settings.jwt.cookieName` has been renamed to `settings.jwt.cookie.name`.

See also [this](./config-system.md#environment-variables).

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

**Warning:** Using the below functions `setAuthCookie` and `removeAuthCookie` is required in order to provide CSRF protection.

**Warning:** In order to _work better_ with some popular frontend frameworks, the default name of the CSRF cookie has been changed from `csrfToken` to `XSRF-TOKEN`.

## New features

New features have been added to reduce the amount of code needed to use JWT as well as to make it easier to use. You can consult the [Quick start page](../authentication-and-access-control/quick-start.md) to see how to use these features.

### JWT cookies

The JWT package has two new functions `setAuthCookie` and `removeAuthCookie` to manage JWT with cookies.

### Read secrets and private/public keys

Secrets and private/public keys can be read from the configuration with the two new functions `getSecretOrPrivateKey` and `getSecretOrPublicKey`. 

Encoded secrets with the configuration key `settings.jwt.secretEncoding` are supported.
