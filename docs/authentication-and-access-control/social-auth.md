# Social Authentication

> Social authentication is available in Foal v1.3.0 onwards.

FoalTS social authentication is based on OAuth2 protocol. To set up social authentication with Foal, you first need to register your application to the social provider you chose (Google, Facebook, etc). This can be done through its website.

Usually your are required to provide:
- an *application name*,
- a *logo*,
- and *redirect URIs* where the social provider should redirect the users after successful authentication (ex: `http://localhost:3001/signin/google/callback`, `https://example.com/signin/facebook/callback`)

Once done, you should receive:
- a *client ID* that is public and identifies your application,
- and a *client secret* that must not be revealed and can therefore only be used on the backend side.

> You must obtain a *client secret*. If you do not have one, it means you probably chose the wrong option at some point.

## Configuration

First install the appropriate package.

```
npm install @foal/social
```

Then, you will need to provide your client ID, client secret and your redirect URIs to Foal. This can be done through the usual [configuration files](../deployment-and-environments/configuration.md).

*default.yml*
```yaml
settings:
  social:
    google:
      clientId: xxx
      redirectUri: 'http://localhost:3001/signin/google/callback'
```

*production.yml*
```yaml
settings:
  social:
    cookie:
      secure: true # In production, your website should use HTTPS.
    google:
      redirectUri: 'https://example.com/signin/google/callback' # Your redirect URI in production
```

*.env*
```
SETTINGS_SOCIAL_GOOGLE_CLIENT_SECRET=yyy
```

## Social Providers

Authentication is managed by *social providers*. These are services whose methods can be called within a controller to build a social login.

```typescript
// 3p
import {
  Context,
  dependency,
  Get,
  HttpResponseRedirect,
  setSessionCookie,
} from '@foal/core';
import { GoogleProvider } from '@foal/social';

import { User } from '../entities';

export class AuthController {
  @dependency
  google: GoogleProvider;

  @Get('/signin/google')
  redirectToGoogle() {
    // Your "Login In with Google" button should point to this route.
    // The user will be redirected to Google auth page.
    return this.google.redirect();
  }

  @Get('/signin/google/callback')
  async handleGoogleRedirection(ctx: Context) {
    // Once the user gives their permission to login with Google, the provider
    // will redirect the user to this route. This route must match the redirect URI.
    const { userInfo, tokens } = await this.google.getUserInfo(ctx);

    // Do something with the user information AND/OR the access token.
    // If you only need the access token, you can call the "getTokens" method.

    // The method usually ends with a HttpResponseRedirect object as returned value.
  }

}
```

You can also override the scopes in the `redirect` method:
```typescript
return this.google.redirect({ scopes: [ 'email' ] });
```

Additional parameters can passed to the `redirect` and `getUserInfo` methods depending on the provider.

### Google

https://developers.google.com/identity/protocols/OpenIDConnect

![Google 2](./google2.png)

Default scopes: profile, email.

#### Get a Refresh Token

```typescript
this.google.redirect({}, { access_type: 'offline' });
}
```

### Facebook

#### Permissions

https://developers.facebook.com/docs/facebook-login/permissions/

Facebook permissions can be requested using OAuth2 *scopes*.

Default scopes: email.

```typescript
this.facebook.redirect({ scopes: [ 'email', 'user_birthday' ] });
```

#### Re-request

If a user has already declined a permission, Facebook Login Dialog will not ask for this permission again. You will need to explicity tell it to re-ask for the declined permission by using the `auth_type` parameter.

```typescript
this.facebook.redirect({}, { auth_type: 'rerequest' });
```

## Sign In and Sign Up Example

This example shows how to implement a sign in and sign up flow with sessions and a TypeORM `User` entity.

*user.entity.ts*
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

}
```

*auth.controller.ts*
```typescript
// 3p
import {
  Context,
  dependency,
  Get,
  HttpResponseRedirect,
  setSessionCookie,
} from '@foal/core';
import { GoogleProvider } from '@foal/social';
import { TypeORMStore } from '@foal/typeorm';
import { getRepository } from 'typeorm';

import { User } from '../entities';

export class AuthController {
  @dependency
  google: GoogleProvider;

  @dependency
  store: TypeORMStore;

  @Get('/signin/google')
  redirectToGoogle() {
    return this.google.redirect();
  }

  @Get('/signin/google/callback')
  async handleGoogleRedirection(ctx: Context) {
    const { userInfo } = await this.google.getUserInfo(ctx);

    let user = getRepository(User).findOne({ email: userInfo.email });

    if (!user) {
      // If the user has not already signed up, then add them to the database.
      user = new User();
      user.email = userInfo.email;
      await getRepository(User).save(user);
    }

    const session = await this.store.createAndSaveSessionFromUser(user));
    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session.getToken());
    return response;
  }

}
```

## Other techniques

### Google

> This section assumes that Google is the only authentication solution you use in your application. You do not use other social providers or passwords. This section does not use the `@foal/social` package.

*A sample application can be found [here](https://github.com/FoalTS/foal/tree/master/samples/google-auth).*

```
npm install @foal/jwt @foal/jwks-rsa
```

First, register your application to Google and add a "Sign-In" button to your frontend:
  - [Android](https://developers.google.com/identity/sign-in/android/start)
  - [iOS](https://developers.google.com/identity/sign-in/ios/start?ver=objc)
  - [Website](https://developers.google.com/identity/sign-in/web/sign-in)
  - [TVs and Devices](https://developers.google.com/identity/sign-in/devices)

![Google 1](./google1.png)

Then, in the backend, add a configuration file that will contain the client ID. This can be an `.env`, YAML or JSON file:

*.env (option 1)*
```
SOCIAL_GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
```

*config/default.yml (option 2)*
```yaml
social:
  google:
    clientId: xxx.apps.googleusercontent.com
```

*config/default.json (option 3)*
```json
{
  "social": {
    "google": {
      "clientId": "xxx.apps.googleusercontent.com"
    }
  }
}
```

Finally, add the `@JWTRequired` hook to your protected routes:

*api.controller.ts*
```typescript
import { Config, Context, Get, HttpResponseOK } from '@foal/core';
import { getRSAPublicKeyFromJWKS } from '@foal/jwks-rsa';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({
  secretOrPublicKey: getRSAPublicKeyFromJWKS({
    jwksUri: 'https://www.googleapis.com/oauth2/v3/certs',
  })
}, {
  audience: Config.get('social.google.clientId'),
  issuer: [ 'accounts.google.com', 'https://accounts.google.com' ]
})
export class ApiController {

  @Get('/')
  index(ctx: Context) {
    return new HttpResponseOK(
      `Your email is ${ctx.user.email}!`
    );
  }

}
```

Now, when making a request to the backend, your frontend must include the Google **ID token** in the `Authorization` header using the `Bearer` scheme:

```
Authorization: Bearer xxx.yyy.zzz
```

For example, in a browser, you can retrieve this token with the following code:

```javascript
function onSignIn(googleUser) {
  var id_token = googleUser.getAuthResponse().id_token;
  // ...
}
```

## Custom Provider

If necessary, you can also implement your own provider. This one must inherit the abstract class `AbstractProvider`.

*Example*
```typescript
// 3p
import { AbstractProvider, SocialTokens } from '@foal/core';

export interface GithubAuthParameter {
  // ...
}

export interface GithubUserInfoParameter {
  // ...
}

export class GithubProvider extends AbstractProvider<GithubAuthParameter, GithubUserInfoParameter> {

  protected configPaths = {
    clientId: 'social.github.clientId',
    clientSecret: 'social.github.clientSecret',
    redirectUri: 'social.github.redirectUri',
  };

  protected authEndpoint = '...';
  protected tokenEndpoint = '...';
  protected userInfoEndpoint = '...'; // Optional. Depending on the provider.

  protected defaultScopes: string[] = [ 'email' ]; // Optional

  async getUserInfoFromTokens(tokens: SocialTokens, params?: GithubUserInfoParameter) {
    // ...
  }

} 
```
