# CSRF protection

> Cross-Site Request Forgery (CSRF) is a type of attack that occurs when a malicious web site, email, blog, instant message, or program causes a user’s web browser to perform an unwanted action on a trusted site when the user is authenticated.
>
> *Source: [OWASP](https://github.com/OWASP/CheatSheetSeries/blob/master/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.md)*

FoalTS provides CSRF protection based on tokens. When activated, the defense requires that POST, PUT, PATCH and DELETE requests include a CSRF token to be valid. If they do not, the server returns a 403 error with the message `Bad csrf token`.

## SameSite Cookie Attribute

## SPA + API

Ex: cli

### Stateful CSRF token (Session-based)

### Stateless CSRF token (Double Submit Cookie Technique)

## Regular Web Applications

### Stateful CSRF token (Session-based)

### Stateless CSRF token (Double Submit Cookie Technique)

## Disable the CSRF protection

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

## Generate CSRF tokens

You can generate CSRF tokens using the `csrfToken` method of the `request` object. When the protection is disabled, the method returns the string `'CSRF protection disabled.'`.

*Example*
```typescript
import { Context, Get } from '@foal/core';

export class AppController {

  @Get('')
  index(ctx: Context) {
    const csrfToken = ctx.request.csrfToken();
    // ...
  }

}
```

## Stateful CSRF Defense (using sessions)

By default, FoalTS provides CSRF protection using sessions.

### How to send CSRF tokens to the client

```typescript
import { Get, render } from '@foal/core';

export class ViewController {
  @Get('/')
  index(ctx) {
    return render('./templates/index.html', {
      csrfToken: ctx.request.csrfToken()
    }, __dirname);
  }
}
```

```html
<html>
  <head></head>
  <body>
    <form action="POST">
      <input style="display: none" name="_csrf" value="<%= csrfToken %>">
      <input name="foobar">
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
```

### How to include a CSRF token in every subsequent request

You must include a CSRF token in your subsequent POST, PUT, PATCH and DELETE requests. Otherwise the server will return a 403 error.

There are several locations where the token can be included:
- in the request body with the name `_csrf`,
- in the request query with the name `_csrf`,
- or in one of these headers: `CSRF-Token`, `XSRF-Token`, `X-CSRF-Token` or `X-XSRF-Token`.

## Stateless CSRF Defense (using Double Submit Cookie technique)

FoalTS also supports the *Double Submit Cookie* technique as CSRF protection. In this case, the protection does not rely on sessions.

You can enable it with the key `settings.csrfOptions.cookie` in the configuration. 

*Example with `config/default.yml`*
```yaml
settings:
  csrf: true
  csrfOptions:
    cookie: true
```

*Example with `.env` (or environment variable)*
```
SETTINGS_CSRF=true
SETTINGS_CSRF_OPTIONS_COOKIE=true
```

### How to send CSRF tokens to the client

```typescript
import { Get, render } from '@foal/core';

export class ViewController {
  @Get('/')
  index(ctx) {
    const response = new HttpResponseOK();
    response.setCookie('csrf-token', ctx.request.csrfToken());
    return response;
  }
}
```

The server generates two cookies on the client named `_csrf` and `csrf-token`. The first one must be included in every subsequent request. The other contains the token that must be included as a header or param/body attribute in your request.

### How to include a CSRF token in every subsequent request

You must include the token value of the previous `csrf-token` cookie in your subsequent POST, PUT, PATCH and DELETE requests. Otherwise the server will return a 403 error.

There are several locations where the token can be included:
- in the request body with the name `_csrf`,
- in the request query with the name `_csrf`,
- or in one of these headers: `CSRF-Token`, `XSRF-Token`, `X-CSRF-Token` or `X-XSRF-Token`.