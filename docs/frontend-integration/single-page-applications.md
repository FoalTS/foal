# Single Page Applications (SPA)

## Presentation

conventional vs rendered pages

why came up

## Building the App & 

development server. See sectin

## Using Frontend Routers

```typescript
import { readFile } from 'fs';
import { promisify } from 'util';

import { controller, Get, HttpResponseOK } from '@foal/core';

import { ApiController, AuthController } from './controllers';

export class AppController {
  subControllers = [
    controller('/api', ApiController),
    controller('/auth', AuthController)
  ];

  @Get('*')
  async notFound() {
    const index = await promisify(readFile)('./public/index.html', 'utf8');
    return new HttpResponseOK(index);
  }
}
```