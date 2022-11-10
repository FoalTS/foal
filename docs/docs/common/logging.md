---
title: Logging
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';


## HTTP Request Logging

FoalTS uses [morgan](https://www.npmjs.com/package/morgan) to log the HTTP requests. You can specify the output format using the environment variable `SETTINGS_LOGGER_FORMAT` or the `config/default.json` file:

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  loggerFormat: tiny
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "loggerFormat": "tiny"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    loggerFormat: "tiny"
  }
}
```

</TabItem>
</Tabs>

## Disabling HTTP Request Logging

In some scenarios and environments, you might want to disable http request logging. You can achieve this by setting the `loggerFormat` configuration option to `none`. 

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  loggerFormat: none
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "loggerFormat": "none"
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    loggerFormat: "none"
  }
}
```

</TabItem>
</Tabs>

## Disabling Error Logging

In some scenarios, you might want to disable error logging (error stack traces that are displayed when an error is thrown in a controller or hook). You can achieve this by setting the `allErrors` configuration option to false. 

<Tabs
  defaultValue="yaml"
  values={[
    {label: 'YAML', value: 'yaml'},
    {label: 'JSON', value: 'json'},
    {label: 'JS', value: 'js'},
  ]}
>
<TabItem value="yaml">

```yaml
settings:
  allErrors: false
```

</TabItem>
<TabItem value="json">

```json
{
  "settings": {
    "allErrors": false
  }
}
```

</TabItem>
<TabItem value="js">

```javascript
module.exports = {
  settings: {
    allErrors: false
  }
}
```

</TabItem>
</Tabs>

## Logging Hook

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

## Advanced Logging

If you need advanced logging, you might be interested in using [winston](https://www.npmjs.com/package/winston), a popular logger in the Node.js ecosystem.

Here's an example on how to use it with Foal:

*LoggerService*
```typescript
import * as winston from 'winston';

export class LoggerService {
  private logger: any;

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: 'logs.txt'
        })
      ]
    });
  }

  info(msg: string) {
    this.logger.info(msg);
  }

  warn(msg: string) {
    this.logger.warn(msg);
  }

  error(msg: string) {
    this.logger.error(msg);
  }

}

```

*LogUserId hook*
```typescript
import { Hook } from '@foal/core';
// LoggerService import.

export function LogUserId() {
  return Hook((ctx, services) => {
    const logger = services.get(LoggerService);
    logger.info(`UserId is: ${ctx.user.id}`);
  });
}

```

*ProductController*
```typescript
import { Get } from '@foal/core';
// LogUserId import.

export class ProductController {

  @Get('/')
  @LogUserId()
  readProducts() {
    ...
  }

}

```

*AuthController*
```typescript
import { dependency, Post } from '@foal/core';
// LoggerService import.

export class AuthController {
  @dependency
  logger: LoggerService;

  @Post('/signup')
  signup() {
    ...
    this.logger.info('Someone signed up!');
  }

}

```