---
title: Ship to Production
---

> You are reading the documentation for version 2 of FoalTS. Instructions for upgrading to this version are available [here](../upgrade-to-v2/README.md). The old documentation can be found [here](https://foalts.org/docs/1.x/).

## Set the Node.JS environment to `production`

Set the `NODE_ENV` environment variable to `production`.

```
NODE_ENV=production npm run start
```

## Use HTTPS

You must use HTTPS to prevent [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). Otherwise, your credentials and authentication tokens will appear in clear on the network.

If you use cookies, make sure to let them only be sent to the server when the request is made using SSL. You can do such thing with the cookie `secure` directive.

*config/production.yml (example)*

```yaml
settings:
  // If you use sessions
  session:
    cookie:
      secure: true
  // If you use JWT
  jwt:
    cookie:
      secure: true
```


## Generate Different Secrets

Use different secrets for your production environment (JWT, etc). Specify them using environment variables or a `.env` file.

*.env (example)*
```
SETTINGS_JWT_SECRET=YZP0iv6gM+VBTxk61l8nKUno2QxsQHO9hm8XfeedZUw
```

You can generate 256-bit secrets encoded in base64 with the following command:

```
foal createsecret
```

## Database Credentials & Migrations

Use different credentials for your production database. Specify them using environment variables or a `.env` file.

If you use database migrations, run them on your production server with the following command:

```
npm run migrations
```

## Files to Upload

If you install dependencies and build the app on the remote host, then you should upload these files:

```sh
config/
ormconfig.js
package-lock.json
package.json
public/ # this may depend on how the platform manages static files
src/
tsconfig.app.json
```

Then you will need to execute `run npm install` and `npm run build`.

If you install dependencies and build the app on your local host directly, then you should upload these files:

```sh
build/
config/
node_modules/
ormconfig.js
package-lock.json
package.json
public/ # this may depend on how the platform manages static files
```