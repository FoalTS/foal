---
title: CSRF Protection
---

> Cross-Site Request Forgery (CSRF) is a type of attack that occurs when a malicious web site, email, blog, instant message, or program causes a user’s web browser to perform an unwanted action on a trusted site when the user is authenticated.
>
> *Source: [OWASP](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)*

There are several ways to defend yourself against a CSRF attack. The better approach is to use both the `SameSite` cookie directive and a token-based technique to have an in-depth protection.

*Note: CSRF protection only makes sense if your authentication system is based on cookies. This is why there is no example for *Mobile+API* applications.*

## SameSite Cookie Attribute

The `SameSite` attribute is a new cookie directive to mitigate the risk of CSRF attacks. As of July 2019, SameSite attribute is on browsers used by 86,57% of Internet users.

### Authentication with Session Tokens

If you use session tokens with the `setSessionCookie`, you can directly define the cookie directives in the configuration.

*Example with config/default.json*
```json
{
  "settings": {
    "session": {
      "cookie": {
        "sameSite": "lax"
      }
    }
  }
}
```

*Example with config/default.yml*
```yaml
settings:
  session:
    cookie:
      sameSite: lax
```

### Authentication with JSON Web Tokens

If you use JSON Web Tokens, then you have to specify the directive manually when sending the token to the browser.

*Example*
```typescript
return new HttpResponseOK()
  .setCookie('auth', token, {
    // ...
    sameSite: 'lax'
  })
```

## Using CSRF Tokens

```
npm install @foal/csrf
```

In addition to the `SameSite` directive it is strongly recommended to use a token-based mitigation technique to provide a robust defense.

Here is the principle:

1. The server generates a token (stateless or stateful) and sends it to the browser (in the HTML page or in a separate cookie). An attacker performing a CSRF attack is not able to guess or read this token.
2. In each subsequent POST, PUT, PATH or DELETE request, the client must include this token in a specific header, in the body of the request or in the URL parameters to prove the "origin" of the request.
3.  If the CSRF token is not present or is incorrect, the server returns an error 403 - FORBIDDEN with the message `Bad csrf token.`.

FoalTS token-based protection provides a hook and a function to set up the defense.
- `getCsrfToken` generates or reads the CSRF token.
- `@CsrfTokenRequired` verifies the CSRF token when receiving requests and returns a 403 error if it is missing or incorrect.

The `@CsrfTokenRequired` expects the CSRF token to be include in the request in either:
- the request body with the name `_csrf`,
- the request query with the name `_csrf`,
- or in one of these headers: `CSRF-Token`, `XSRF-Token`, `X-CSRF-Token` or `X-XSRF-Token`.

### Regular Web Applications

*Regular Web Applications* use *Server-Side Rendering* to generate their HTML pages. 

#### Stateful CSRF token (Session-based)

1. Generate the token on login

```typescript
import { HttpResponseOK, Post, setSessionCookie } from '@foal/core';

class AuthController {
  // ...

  @Post('/login')
  async login() {
    // ...
    const session = await this.store.createAndSaveSessionFromUser(
      user,
      // Generate the CSRF token and keep it in the session
      { csrfToken: true }
    );

    const response = new HttpResponseOK();
    setSessionCookie(response, session.getToken());
    return response;
  }
}
```

2. Include the token in each rendered page.

```typescript
import { Context, Get, TokenRequired, render } from '@foal/core';
import { TypoORMStore } from '@foal/typeorm';
import { getCsrfToken } from '@foal/csrf';
 
@TokenRequired({
  cookie: true,
  redirectTo: '/login',
  store: TypeORMStore, // Or another store: RedisStore, MongoDBStore, etc.
})
class PageController {
  @Get('/home')
  async home(ctx: Context) {
    return render(
      './templates/home.html',
      // Retreive the token from the session
      // and include it in the rendered page
      { csrfToken: await getCsrfToken(ctx.session) }
    );
  }
}
```

*Home.html (example with a form)*
```html
<html>
  <head></head>
  <body>
    <form action="POST">
      <input style="display: none" name="_csrf" value="{{ csrfToken }}">
      <!--
        OR if you use EJS:
        <input style="display: none" name="_csrf" value="<%= csrfToken %>">
      -->
      <input name="foobar">
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
```

*home.html (example with JavaScript)*
```html
<html>
  <head>
    <meta name="csrf-token" content="{{ csrfToken }}">
    <!--
      OR if you use EJS:
      <meta name="csrf-token" content="<%= csrfToken %>">
    -->
  </head>
  <body>
    ...
    <script type="text/javascript">
      var csrf_token = document
        .querySelector("meta[name='csrf-token']")
        .getAttribute("content");
      // Add the token in a header (ex: CSRF-TOKEN) when making request
    </script>
  </body>
</html>
```

3. Check the CSRF token on each subsequent POST, PUT, PATCH and DELETE request.

```typescript
import { Post, TokenRequired } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { CsrfTokenRequired } from '@foal/csrf';

@TokenRequired({
  cookie: true,
  store: TypeORMStore, // Or another store: RedisStore, MongoDBStore, etc.
})
@CsrfTokenRequired()
class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseCreated();
  }
}
```

#### Stateless CSRF token (Double Submit Cookie Technique)

If you want to use stateless CSRF tokens, you need to provide a base64-encoded secret in either:
- a configuration file

    *Example with config/default.yml*
    ```yaml
    settings:
      csrf:
        secret: xxx
    ```
- or in a `.env` file or in an environment variable:
    ```
    SETTINGS_CSRF_SECRET=xxx
    ```

You can generate such a secret with the CLI command:
```
foal createsecret
```

1. Generate a token and send it in a cookie when rendering a page.

```typescript
import { Context, Get, HttpResponseOK } from '@foal/core';
import { getCsrfToken, setCsrfCookie } from '@foal/csrf';

class PageController {
  @Get('/home')
  async home(ctx: Context) {
    // Normally in an HTML template
    const response = new HttpResponseOK();
    // Include a random CSRF token in the cookie
    setCsrfCookie(response, await getCsrfToken());
    return response;
  }
}
```

*home.html (example with JavaScript)*
```html
<html>
  <head>
  </head>
  <body>
    ...
    <script type="text/javascript">
      var csrf_token = // use a library to get the cookie value from document.cookie
      // Add the token in a header (ex: CSRF-TOKEN) when making request
    </script>
  </body>
</html>
```

2. Check the CSRF token on each subsequent POST, PUT, PATCH and DELETE request.

```typescript
import { HttpResponseCreated, Post } from '@foal/core';
import { CsrfTokenRequired } from '@foal/csrf';

@CsrfTokenRequired({ doubleSubmitCookie: true })
class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseCreated();
  }
}
```

### SPA + API

In *Single-Page Application + API* architecture, the frontend application is static and the pages are rendered in the browser.

First set the configuration key `settings.csrf.cookie.maxAge` to a very large number (for example one year).

*Example with config/default.json*
```json
{
  "settings": {
    "csrf": {
      "cookie": {
        "maxAge": 31536000
      }
    }
  }
}
```

*Example with config/default.yml*
```yaml
settings:
  csrf:
    cookie:
      maxAge: 31536000 # One year
```

#### Stateful CSRF token (Session-based)

1. Generate the token and send it in a cookie on login.

```typescript
// ...
import { getCsrfToken, setCsrfCookie } from '@foal/csrf';
// ...
class AuthController {
    // ...

    @Post('/login')
    async login() {
      // ...
      const session = await this.store.createAndSaveSessionFromUser(
        user,
        // Generate the CSRF token and keep it in the session
        { csrfToken: true }
      );

      const response = new HttpResponseOK();
      setSessionCookie(response, session.getToken());
      // Retreive the token from the session
      // and send it in a cookie
      setCsrfCookie(response, await getCsrfToken(session));
      return response;
    }
  }
```

Your frontend application then must retreive the token from the cookie named `csrfToken` and send it on each subsequent POST, PUT, PATCH or DELETE request (for example using the header `CSRF-Token`).

2. Check the CSRF token on each subsequent POST, PUT, PATCH and DELETE request.

```typescript
import { HttpResponseCreated, Post, TokenRequired } from '@foal/core';
import { TypeORMStore } from '@foal/typeorm';
import { CsrfTokenRequired } from '@foal/csrf';

@TokenRequired({
  cookie: true,
  store: TypeORMStore, // Or another store: RedisStore, MongoDBStore, etc.
})
@CsrfTokenRequired()
class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseCreated();
  }
}
```

#### Stateless CSRF token (Double Submit Cookie Technique)

If you want to use stateless CSRF tokens, you need to provide a base64-encoded secret in either:
- a configuration file

    *Example with config/default.yml*
    ```yaml
    settings:
      csrf:
        secret: xxx
        cookie:
          maxAge: 31536000 # One year
    ```
- or in a `.env` file or in an environment variable:
    ```
    SETTINGS_CSRF_SECRET=xxx
    ```

You can generate such a secret with the CLI command:
```
foal createsecret
```

1. Generate a token and send it in a cookie on login.

```typescript
import { HttpResponseOK, Post } from '@foal/core';
import { getCsrfToken, setCsrfCookie } from '@foal/csrf';

class AuthController {
  @Post('/login')
  async login() {
    const response = new HttpResponseOK();
    setCsrfCookie(response, await getCsrfToken());
    return response;
  }
}
```

Your frontend application then must retreive the token from the cookie named `csrfToken` and send it on each subsequent POST, PUT, PATCH or DELETE request (for example using the header `CSRF-Token`).

2. Check the CSRF token on each subsequent POST, PUT, PATCH and DELETE request.

```typescript
import { HttpResponseCreated, Post } from '@foal/core';
import { CsrfTokenRequired } from '@foal/csrf';

@CsrfTokenRequired({ doubleSubmitCookie: true })
class ApiController {
  @Post('/products')
  createProduct() {
    return new HttpResponseCreated();
  }
}
```

### Disable the CSRF protection

The CSRF hook `@CsrfTokenRequired` can be disabled on a specific environment using the configuration key `settings.csrf.enabled`.

*Example with `config/test.json`*
```json
{
  "settings": {
    "csrf": {
      "enabled": false
    }
  }
}
```

*Example with `config/test.yml`*
```yaml
settings:
  csrf:
    enabled: false
```

*Example with environment variable*
```
SETTINGS_CSRF_ENABLED=false
```

### Advanced

The directives of the cookie written by `setCsrfCookie` can be override in the configuration.

*Example with config/default.yml*
```yaml
settings:
  csrf:
    cookie:
      name: my-custom-name
      domain: example.com
      path: /foo # default: /
      sameSite: lax
      secure: true
      maxAge: 10000
```
