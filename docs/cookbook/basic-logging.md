# Basic logging

FoalTS provides a convenient hook to log basic messages: `Log(message: string, options: LogOptions = {})`

Example:
```typescript
import { Get, HttpResponseOK, Log } from '@foal/core';

@Log('Message', {
  body: true,
  headers: [ 'X-CSRF-Token' ],
  params: true,
  query: true
})
export class AppController {
  @Get()
  index() {
    return new HttpResponseOK();
  }
}
```
