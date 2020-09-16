# JWT hooks and CSRF protection

## Configuration

The configuration `settings.jwt.secretOrPublicKey` has been removed. Use `settings.jwt.secret` or `settings.jwt.publicKey` instead.

## CSRF protection

```
npm uninstall @foal/csrf
```

The package `@foal/csrf` has been removed. In version 2, the CSRF protection is directly included in the JWT hooks and can be enabled with `settings.jwt.csrf.enabled`.

There is no need anymore to provide a CSRF secret.

There is no need anymore to set manually the value of the `sameSite` cookie attribute in the config.

There is no need anymore to specify an expire time for the CSRF cookie.

The best way to use the new CSRF protection is to go directly to the [CSRF page](./../security/csrf-protection.md)