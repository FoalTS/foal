---
title: Deployment Checklist
sidebar_label: Checklist
---


## Set the Node.JS environment to `production`

Set the `NODE_ENV` (or `FOAL_ENV`) environment variable to `production`.

```bash
NODE_ENV=production npm run start
```

## Use HTTPS

You must use HTTPS to prevent [man-in-the-middle attacks](https://en.wikipedia.org/wiki/Man-in-the-middle_attack). Otherwise, your credentials and authentication tokens will appear in clear on the network.

If you use cookies, make sure to let them only be sent to the server when the request is made using SSL. You can do such thing with the cookie `secure` directive.

*config/production.yml (example)*

```yaml
settings:
  # If you use sessions
  session:
    cookie:
      secure: true
  # If you use JWT
  jwt:
    cookie:
      secure: true
  # If you use social authentication
  social:
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

```bash
npx foal createsecret
```

## Database Credentials & Migrations

Use different credentials for your production database. Specify them using environment variables or a `.env` file.

If you use database migrations, run them on your production server with the following command:

```bash
npm run migrations
```

## Files to Upload

If you install dependencies and build the app on the remote host, then you should upload these files:

```sh
config/
package-lock.json
package.json
public/ # this may depend on how the platform manages static files
src/
tsconfig.app.json
```

Then you will need to run `npm install` and `npm run build`.

> If you get an error such as `Foal not found error`, it is probably because the dev dependencies (which include the `@foal/cli` package) have not been installed. To force the installation of these dependencies, you can use the following command: `npm install --production=false`.

If you install dependencies and build the app on your local host directly, then you should upload these files:

```sh
build/
config/
node_modules/
package-lock.json
package.json
public/ # this may depend on how the platform manages static files
```
