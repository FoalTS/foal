---
title: Solicitudes CORS
sidebar_label: CORS
---


Building a public API requires to allow Cross-Origin Request Sharing.

## Enable Cross-Origin Resource Sharing (CORS)

> If you are building a web application, **you may not need to enable CORS for your API**. See [here](../frontend/angular-react-vue.md) the section *Origins that Do not Match*.

If you want different origins to make requests to your API from a browser, you need to enable [Cross-Origin Resource Sharing](https://www.html5rocks.com/en/tutorials/cors/).

You can do that by adding a route handler and a special hook to your API root controller (`APIController` in this example).

```typescript
import { Context, Hook, HttpResponseNoContent, Options } from '@foal/core';

@Hook(() => response => {
  // Every response of this controller and its sub-controllers will be added this header.
  response.setHeader('Access-Control-Allow-Origin', '*');
})
export class ApiController {

  subControllers = [
    // your sub-controllers
  ];

  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
    // You may need to allow other headers depending on what you need.
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return response;
  }

  // Some other routes (ex: @Get('/users'), etc)

}
```

## CORS Requests and `Authorization` header

If your API requires a token to be sent in the `Authorization` header, then the name of this header should be specified in the `options` handler.

```typescript
  @Options('*')
  options(ctx: Context) {
    const response = new HttpResponseNoContent();
    response.setHeader('Access-Control-Allow-Methods', 'HEAD, GET, POST, PUT, PATCH, DELETE');
    response.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    return response;
  }
```

> The same goes with other headers: `X-Requested-With`, etc.

## CORS Requests and Cookies

If your API uses cookies (for authentication for example), then you should specify it in the hook with the `Access-Control-Allow-Credentials` header.

```typescript
@Hook(ctx => response => {
  response.setHeader('Access-Control-Allow-Origin', ctx.request.get('Origin') || '*');
  response.setHeader('Access-Control-Allow-Credentials', 'true');
})
```

In the browser, your HTTP client must also have its `withCredentials` option set to `true`.

**Examples**

*[XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest)*
```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', 'http://example.com/', true); 
xhr.withCredentials = true; 
xhr.send(null);
```

*[Axios](https://github.com/axios/axios)*
```javascript
axios.get('http://example.com/', { withCredentials: true });
```

*[Angular HttpClient](https://angular.io/guide/http)*
```javascript
this.http.get('http://example.com/', { withCredentials: true });
```

*[fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)*
```javascript
fetch('http://example.com/', { credentials: 'include' });
```
