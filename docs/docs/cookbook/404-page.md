---
title: 404 Page
---

> You are reading the documentation for version 2 of FoalTS. Instructions for upgrading to this version are available [here](../upgrade-to-v2/README.md). The old documentation can be found [here](https://github.com/FoalTS/foal/tree/v1.x/docs).

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