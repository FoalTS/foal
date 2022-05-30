---
title: Page 404
---


Here's a way to implement custom 404 pages.

```typescript
import { Get, HttpResponseNotFound, HttpResponseOK } from '@foal/core';

class ViewController {
  @Get('/home')
  home() {
    return new HttpResponseOK('You are on the home page!');
  }
}

class AppController {
  subControllers = [ ViewController ];

  @Get('*')
  notFound() {
    return new HttpResponseNotFound('The page you are looking for does not exist.');
  }
}
```

In case you want to intercept all HTTP verbs (POST, PUT, etc), you can also use the `@All` decorator for this.

```typescript
import { All, HttpResponseNotFound } from '@foal/core';

class AppController {
  subControllers = [ ViewController ];

  @All('*')
  notFound() {
    return new HttpResponseNotFound('The route you are looking for does not exist.');
  }
}
```