---
title: CSRF Protection
sidebar_label: CSRF
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';



> Cross-Site Request Forgery (CSRF) is a type of attack that occurs when a malicious web site, email, blog, instant message, or program causes a user’s web browser to perform an unwanted action on a trusted site when the user is authenticated.
>
> *Source: [OWASP](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)*

## Defense Principle

FoalTS combines two defenses to protect your application against a CSRF attack. It uses the `SameSite` cookie directive and a token-based technique to have in-depth protection.

When enabled, authentication cookies have their `SameSite` attribute set to `lax` in order to prevent third-party websites from sending authenticated requests to your server. When they make a POST, PUT, PATCH or DELETE request to your application, the authentication cookie is not sent. As of November 2022, this protection is supported by 96% of modern browsers.

In addition, the framework provides token-based mitigation that works with either state (session tokens) or stateless (JWT). The client can read the *CSRF token* either from the HTML page (using a template) or from the `XSRF-Token` cookie. Then, the token must be included in the `X-XSRF-Token` header, the `X-CSRF-Token` header or in the body with the `_csrf` field in any POST, PUT, PATCH or DELETE request sent to the server (see examples).

### Authentication with Session Tokens

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  session:
    csrf:
      enabled: true
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "session": {
      "csrf": {
        "enabled": true
      }
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    session: {
      csrf: {
        enabled: true
      }
    }
  }
}
```

</TabItem>
</Tabs>

### Authentication with JSON Web Tokens

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  jwt:
    csrf:
      enabled: true
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "jwt": {
      "csrf": {
        "enabled": true
      }
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    jwt: {
      csrf: {
        enabled: true
      }
    }
  }
}
```

</TabItem>
</Tabs>

## Examples

### Single-Page Applications (session tokens)

#### Server

*auth.controller.ts*
```typescript
import {
  Context,
  createSession,
  dependency,
  HttpResponseNoContent,
  HttpResponseUnauthorized,
  Post,
  Store,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';

import { User } from '../entities';

const credentialsSchema = { /* ... */ };

export class AuthController {
  @dependency
  store: Store;

  @Post('/login')
  @ValidateBody(credentialsSchema)
  @UseSessions({
    cookie: true,
    required: false,
  })
  async login(ctx: Context) {
    const user = await User.findOneBy({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    ctx.session = ctx.session || await createSession(this.store);
    ctx.session.setUser(user);

    return new HttpResponseNoContent();
  }
}
```

*api.controller.ts*
```typescript
import { HttpResponseCreated, UseSessions } from '@foal/core';

@UseSessions({
  cookie: true,
  required: true,
})
export class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseCreated();
  }
}
```

#### Client

The client must retrieve the *CSRF token* from the `XSRF-Token` cookie and then send it in the `X-XSRF-Token` header, the `X-CSRF-Token` header or in the request body with the `_csrf` field.

Most modern request libraries already handle it automatically for you using the `X-XSRF-Token` header.

<Tabs
  defaultValue="angular"
  values={[
    {label: 'Angular HttpClient', value: 'angular'},
    {label: 'Axios', value: 'axios'},
    {label: 'Native JavaScript', value: 'native'},
  ]}
>

<TabItem value="angular">

No additional configuration required.

</TabItem>
<TabItem value="axios">

No additional configuration required.

</TabItem>
<TabItem value="native">

```typescript
async function postData(url = '', data = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      // Assuming you use this library: https://www.npmjs.com/package/js-cookie.
      'X-XSRF-TOKEN': Cookies.get('XSRF-Token')
    },
    body: JSON.stringify(data),
  });
  return response.json();
}
```

</TabItem>
</Tabs>

### Single-Page Applications (JWTs)

#### Server

*auth.controller.ts*
```typescript
import {
  Context,
  HttpResponseNoContent,
  HttpResponseUnauthorized,
  Post,
  ValidateBody,
  verifyPassword
} from '@foal/core';
import { getSecretOrPrivateKey, setAuthCookie } from '@foal/jwt';
import { sign } from 'jsonwebtoken';

import { User } from '../entities';

const credentialsSchema = { /* ... */ };

export class AuthController {
  @Post('/login')
  @ValidateBody(credentialsSchema)
    async login(ctx: Context) {
    const user = await User.findOneBy({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseUnauthorized();
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseUnauthorized();
    }

    const token: string = await new Promise((resolve, reject) => {
      sign(
        { email: user.email },
        getSecretOrPrivateKey(),
        { subject: user.id.toString() },
        (err, encoded) => {
          if (err) {
            return reject(err);
          }
          resolve(encoded as string);
        }
      );
    });

    const response = new HttpResponseNoContent();
    // Do not forget the "await" keyword.
    await setAuthCookie(response, token);
    return response;
  }
}
```

*api.controller.ts*
```typescript
import { HttpResponseCreated } from '@foal/core';
import { JWTRequired } from '@foal/jwt';

@JWTRequired({
  cookie: true,
})
export class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseCreated();
  }
}
```

#### Client

Same as session tokens.

### Regular Web Applications (session tokens)

*Regular Web Applications* use *Server-Side Rendering* to generate their HTML pages. 

#### Server

*auth.controller.ts*
```typescript
import {
  Context,
  createSession,
  dependency,
  HttpResponseRedirect,
  Post,
  Store,
  UseSessions,
  ValidateBody,
  verifyPassword
} from '@foal/core';

import { User } from '../entities';

const credentialsSchema = { /* ... */ };

export class AuthController {
  @dependency
  store: Store;

  @Post('/login')
  @ValidateBody(credentialsSchema)
  @UseSessions({
    cookie: true,
    required: false,
  })
  async login(ctx: Context) {
    const user = await User.findOneBy({ email: ctx.request.body.email });

    if (!user) {
      return new HttpResponseRedirect('/login');
    }

    if (!await verifyPassword(ctx.request.body.password, user.password)) {
      return new HttpResponseRedirect('/login');
    }

    ctx.session = ctx.session || await createSession(this.store);
    ctx.session.setUser(user);

    return new HttpResponseRedirect('/products');
  }
}
```

*view.controller.ts*
```typescript
import {
  Context,
  dependency,
  Get,
  render,
  Store,
  UseSessions,
} from '@foal/core';

export class ViewController {
  @dependency
  store: Store;

  @Get('/login')
  async login(ctx: Context) {
    return render('./templates/login.html');
  }

  @Get('/products')
  @UseSessions({
    cookie: true,
    required: true,
    redirectTo: '/login'
  })
  async index(ctx: Context) {
    return render(
      './templates/products.html',
      { csrfToken: ctx.session!.get('csrfToken') },
    );
  }
}
```


*api.controller.ts*
```typescript
import { HttpResponseRedirect, UseSessions } from '@foal/core';

@UseSessions({
  cookie: true,
  required: true,
  redirectTo: '/login'
})
export class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseRedirect('/products');
  }
}
```

#### Client

*login.html*
```html
<html>
  <head>
    <title>Log in</title>
  </head>
  <body>
    <form method="POST" action="/login">
      <input name="email" type="email" >
      <input name="password" type="password" >
      <button type="submit">Log in</button>
    </form>
  </body>
</html>
```

*products.html*
```html
<html>
  <head>
    <title>Add a product</title>
  </head>
  <body>
    <form method="POST" action="/api/products">
      <input style="display: none" name="_csrf" value="{{ csrfToken }}">
      <input name="name" type="text">
      <button type="submit">Add product</button>
    </form>
  </body>
</html>
```

## Advanced

### Increase stateless protection (JWT)

In FoalTS, stateless CSRF protection is based on the double submit technique. CSRF tokens are generated randomly and signed with the JWT secret or RSA private key.

To increase the effectiveness of protection against sub-domain attacks, your auth JWT must include a unique `subject` per user (usually the user ID) and an expiration date. The framework will then use these to create and sign the *CSRF token*.

### Custom CSRF cookie name

The name of the CSRF cookie can be changed in the configuration.

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  jwt:
    csrf:
      enabled: true
      cookie:
        name: CSRF-Token # Default: XSRF-TOKEN
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "jwt": {
      "csrf": {
        "enabled": true,
        "cookie": {
          "name": "CSRF-Token"
        }
      }
    }
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    jwt: {
      csrf: {
        enabled: true,
        cookie: {
          name: "CSRF-Token"
        }
      }
    }
  }
}
```

</TabItem>
</Tabs>

### Disable CSRF protection on a specific route

In case the CSRF protection is enabled globally and you want to disable it for a specific route, you can use the `csrf` option for that.

```typescript
import { HttpResponseOK, Post, UseSessions } from '@foal/core';

export class ApiController {
  @Post('/foo')
  @UseSessions({ cookie: true })
  foo() {
    // This method has the CSRF protection enabled.
    return new HttpResponseOK();
  }

  @Post('/bar')
  @UseSessions({ cookie: true, csrf: false })
  bar() {
    // This method does not have the CSRF protection enabled.
    return new HttpResponseOK();
  }
}

```
