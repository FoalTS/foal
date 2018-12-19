# Logging & Debugging

FoalTS provides a convenient hook for logging debug messages: `Log(message: string, options: LogOptions = {})`.

```typescript
interface LogOptions {
  body?: boolean;
  params?: boolean;
  headers?: string[]|boolean;
  query?: boolean;
}
```

*Example:*
```typescript
import { Get, HttpResponseOK, Log } from '@foal/core';

@Log('AppController', {
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
