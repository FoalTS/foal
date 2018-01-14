# Controller factories

Controller factories let you create a controller from a given service. Some already exist such as `rest` or `view` in the `@foal/common` package. But you can also create your own.

First define the interface of the `Service`s you will use. For example:

```typescript
interface MyService {
  giveMeANumber(start: number, end: number): number
}
```

Then create your controller factory from the `ControllerFactory` abstract class.

```typescript
import { MethodNotAllowedError } from '@foal/common';
import {
  Context,
  ControllerFactory,
  Route
} from '@foal/core';

import { MyService } from '../services';

export class MyControllerFactory extends ControllerFactory<MyService> {
  public getRoutes(service: MyService): Route[] {
    return [
      {
        httpMethod: 'GET',
        middleware: (context: Context) => {
          return service.giveMeANumber(5, 10)
        },
        path: '/',
        serviceMethodName: 'giveMeANumber',
        successStatus: 200,
      },
      {
        httpMethod: 'POST',
        middleware: (context: Context) => { throw new MethodNotAllowedError(); },
        path: '/',
        serviceMethodName: null,
        successStatus: 200,
      }
    ];
  }
}

export const myControllerFactory = new MyControllerFactory();
```