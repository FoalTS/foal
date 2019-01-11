# Logging & Debugging

## HTTP Request Logging

FoalTS uses [morgan](https://www.npmjs.com/package/morgan) to log the HTTP requests. You can specify the output format using the environment variable `SETTINGS_LOGGER_FORMAT` or the `config/settings.json` file:

```json
{
  ...
  "loggerFormat": "tiny"
}
```

## Custom Logging

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
