# Basic logging

FoalTS provides a convenient hook to log basic messages: `Log(message: string, logFn = console.log)`

Example:
```typescript
import { IModule } from '@foal/core';

@Log('Message')
export class MyModule implements IModule {
  controllers = [
    // the controllers
  ]
}
```
