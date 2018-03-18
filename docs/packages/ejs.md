# @foal/ejs

`@foal/ejs` provides abstract classes to render [EJS](http://ejs.co/) templates.

## `EjsTemplateService`

It implements the `IView` interface.

`index-view.service.ts`
```typescript
import { Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
export class IndexViewService extends EjsTemplateService {
  constructor() {
    super(__dirname + '/templates/index.html');
  }
}
```

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

It implements the `IMultipleViews` interface.

`admin-views.service.ts`
```typescript
import { Service } from '@foal/core';
import { MultipleEjsTemplatesService } from '@foal/ejs';

@Service()
export class AdminViewsService extends MultipleEjsTemplatesService {
  constructor() {
    super({
      billing: __dirname + '/templates/billing.html',
      users: __dirname + '/templates/users.html'
    });
  }
}
```

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