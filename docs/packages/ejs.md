# @foal/ejs

`@foal/ejs` provides abstract classes to render [EJS](http://ejs.co/) templates.

## `EjsTemplateService`

It implements the `ViewService` interface.

`index-view.service.ts`
```typescript
import { Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
export class IndexViewService extends EjsTemplateService {
  constructor() {
    super('./templates/index.html');
  }
}
```

> Note that the path `./templates/index.html` is relative to the directory from where you launch your node process. If you want it to be relative to the directory of `index-view.service.ts`, you must import the `path` package and write instead `path.join(__dirname, 'templates/index.html')`.

`templates/index.html`
```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Hello world!</title>
</head>
<body>
  <h1>Hello world! My name is <%= name %>!</h1>
</body>
</html>
```

`app.module.ts`
```typescript
import { view } from '@foal/common';
import { Module } from '@foal/core';

import { IndexViewService } from './index-view.service';

export const AppModule: Module = {
  controllers: [
    view
      .attachService('/', IndexViewService)
      .withPreHook(ctx => { ctx.state.locals = { name: 'FoalTS' }; })
  ],
};

```

## `MultipleEjsTemplatesService`

It implements the `MultipleViewsService` interface.

`admin-views.service.ts`
```typescript
import { Service } from '@foal/core';
import { MultipleEjsTemplatesService } from '@foal/ejs';

@Service()
export class AdminViewsService extends MultipleEjsTemplatesService {
  constructor() {
    super({
      billing: './templates/billing.html',
      users: './templates/users.html'
    });
  }
}
```

> Note that the path `./templates/*.html` are relative to the directory from where you launch your node process. If you want it to be relative to the directory of `index-view.service.ts`, you must import the `path` package and write instead `path.join(__dirname, 'templates/*.html')`.

`app.module.ts`
```typescript
import { multipleViews } from '@foal/common';
import { Module } from '@foal/core';

import { AdminViewsService } from './admin-views.service';

export const AppModule: Module = {
  controllers: [
    multipleViews
      .attachService('/admin', AdminViewsService, {
        views: {
          billing: '/billing',
          users: '/users'
        }
      })
      .withPreHook(ctx => { ctx.state.locals = { name: 'FoalTS' }; })
  ],
};

```