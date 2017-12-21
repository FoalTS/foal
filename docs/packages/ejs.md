# @foal/ejs

`@foal/ejs` provides an abstract class to render ejs templates. It implements the `ViewService` interface.

## Example

`index-view.service.ts`
```typescript
import { preHook, Service } from '@foal/core';
import { EjsTemplateService } from '@foal/ejs';

@Service()
@preHook(ctx => ctx.state.name = 'FoalTS')
export class IndexViewService extends EjsTemplateService {
  constructor() {
    super('./templates/index.html');
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
import { FoalModule, view } from '@foal/core';

import { IndexViewService } from './index-view.service';

export const AppModule: FoalModule = {
  controllerBindings: [
    view.bindController('/', IndexViewService),
  ],
  services: [ IndexViewService ],
};

```