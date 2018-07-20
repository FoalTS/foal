# Basic logging

// Add a little get-started (some code or a cli command)

## `log(message: string, logFn = console.log)`

Logs the message with the given log function (default is `console.log`).

// Add other examples with controller class and methods

Example:
```typescript
import { IModule, Module } from '@foal/core';

@Module()
@Log('Message')
export class MyModule implements IModule {
  controllers = [
    // the controllers
  ]
}
```
