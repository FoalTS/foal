# Social Authentication

> FoalTS social authentication is based on OAuth2 protocol.

To set up social authentication with Foal, you first need to register your application to the social provider you chose (Google, Facebook, etc). This can be done through its website.

Usually your are required to provide:
- an *application name*,
- a *logo*,
- and *redirect URIs* where the social provider should redirect the users after successful authentication (ex: `http://localhost:3001`, `https://example.com`)

Once done, you should receive:
- a *client ID* that is public and identifies your application,
- and possibly a *client secret* that must not be revealed and can therefore only be used on the backend side.

## Google

### SPA + API, Mobile + API, TVs & Devices + API (technique 1)

TODO.

### SPA + API, Regular Web Applications (technique 2, cookies required)

Coming soon.

## Facebook

### SPA + API, Mobile + API, Devices + API (technique 1)

TODO.

### SPA + API, Regular Web Applications (technique 2, cookies required)

Coming soon.

## Auth0

## AWS Cognito

## Firebase