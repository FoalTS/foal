---
title: Social Authentication
sidebar_label: Social Auth
---

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

|Service name| Default scopes | Available scopes |
|---|---|---|
| `GoogleProvider` | `openid`, `profile`, `email` | [Google scopes](https://developers.google.com/identity/protocols/googlescopes) |

#### Register an OAuth application

Visit the [Google API Console](https://console.developers.google.com/apis/credentials) to obtain a client ID and a client secret.

#### Redirection parameters

The `redirect` method of the `GoogleProvider` accepts additional parameters. These parameters and their description are listed [here](https://developers.google.com/identity/protocols/OpenIDConnect#authenticationuriparameters) and are all optional.

*Example*
```typescript
this.google.redirect({ /* ... */ }, {
  access_type: 'offline'
})
```

### Facebook

|Service name| Default scopes | Available scopes |
|---|---|---|
| `FacebookProvider` | `email` | [Facebook permissions](https://developers.facebook.com/docs/facebook-login/permissions/) |

#### Register an OAuth application

Visit [Facebook's developper website](https://developers.facebook.com/) to create an application and obtain a client ID and a client secret.

#### Redirection parameters

The `redirect` method of the `FacebookProvider` accepts an additional `auth_type` parameter which is optional.

*Example*
```typescript
this.facebook.redirect({ /* ... */ }, {
  auth_type: 'rerequest'
});
```

|Name|Type|Description|
|---|---|---|
|`auth_type`|`'rerequest'`|If a user has already declined a permission, the Facebook Login Dialog box will no longer ask for this permission. The `auth_type` parameter explicity tells Facebook to ask the user again for the denied permission.|

#### User info parameters

The `getUserInfo` and `getUserInfoFromTokens` methods of the `FacebookProvider` accept an additional `fields` parameter which is optional.

*Example*
```typescript
const { userInfo } = await this.facebook.getUserInfo(ctx, {
  fields: [ 'email' ]
})
```

|Name|Type|Description|
|---|---|---|
|`fields`|`string[]`|List of fields that the returned user info object should contain. These fields may or may not be available depending on the permissions (`scopes`) that were requested with the `redirect` method. Default: `['id', 'name', 'email'].`|

### Github

> Github provider is available in Foal v1.4.0 onwards.

|Service name| Default scopes | Available scopes |
|---|---|---|
| `GithubProvider` | none | [Github scopes](https://developer.github.com/apps/building-oauth-apps/understanding-scopes-for-oauth-apps/#available-scopes) |

#### Register an OAuth application

Visit [this page](https://github.com/settings/applications/new) to create an application and obtain a client ID and a client secret.

Additional documentation on Github's redirect URLs can be found [here](https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#redirect-urls).

#### Redirection parameters

The `redirect` method of the `GithubProvider` accepts additional parameters. These parameters and their description are listed below and are all optional.

*Example*
```typescript
this.github.redirect({ /* ... */ }, {
  allow_signup: false
})
```

|Name|Type|Description|
|---|---|---|
| `login` | `string` | Suggests a specific account to use for signing in and authorizing the app. |
| `allow_signup` | `boolean` | Whether or not unauthenticated users will be offered an option to sign up for GitHub during the OAuth flow. The default is `true`. Use `false` in the case that a policy prohibits signups. |

> *Source: https://developer.github.com/apps/building-oauth-apps/authorizing-oauth-apps/#parameters*

### LinkedIn

> LinkedIn provider is available in Foal v1.4.0 onwards.

|Service name| Default scopes | Available scopes |
|---|---|---|
| `LinkedInProvider` | `r_liteprofile` | [API documentation](https://docs.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api) |

#### Register an OAuth application

Visit [this page](https://www.linkedin.com/developers/apps/new) to create an application and obtain a client ID and a client secret.

#### User info parameters

The `getUserInfo` and `getUserInfoFromTokens` methods of the `LinkedInProvider` accept an additional `projection` parameter which is optional.

*Example*
```typescript
const { userInfo } = await this.linkedin.getUserInfo(ctx, {
  fields: [ 'id', 'firstName' ]
})
```

|Name|Type|Description|
|---|---|---|
| `fields` | `string[]` | List of fields that the returned user info object should contain. Additional documentation on [field projections](https://developer.linkedin.com/docs/guide/v2/concepts/projections). |
| `projection` | `string` | LinkedIn projection parameter. |

## Sign In and Sign Up Example

This example shows how to implement a sign in and sign up flow with sessions and a TypeORM `User` entity.

*user.entity.ts*
```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

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

    let user = await getRepository(User).findOne({ email: userInfo.email });

    if (!user) {
      // If the user has not already signed up, then add them to the database.
      user = new User();
      user.email = userInfo.email;
      await getRepository(User).save(user);
    }

    const session = await this.store.createAndSaveSessionFromUser(user);
    const response = new HttpResponseRedirect('/');
    setSessionCookie(response, session.getToken());
    return response;
  }

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
