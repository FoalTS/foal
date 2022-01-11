---
title: 404 Page
---

Here's a way to implement custom 404 pages.

```typescript
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
    return new HttpResponseNotFound('The page your are looking for does not exist');
  }
}
```