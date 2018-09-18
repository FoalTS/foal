# Basic logging

FoalTS provides a convenient hook to log basic messages: `Log(message: string, logFn = console.log)`

Example:
```typescript
import { Get, HttpResponseOK, Log } from '@foal/core';

@Log('Message')
export class AppController {
  @Get()
  index() {
    return new HttpResponseOK();
  }
}
```
