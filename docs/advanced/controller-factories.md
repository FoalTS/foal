# Controller factories

Controller factories are objects that create controllers from services or functions. They should be the only the way to create them.

## The `basic` controller factory

## The service controller factories

Some already exist such as `rest` or `view` in the `@foal/common` package. But you can also create your own.

First define the interface of the `Service`s you will use. For example:

```typescript
interface MyService {
  giveMeANumber(start: number, end: number): number
}
```

Then create your controller factory from the `ControllerFactory` abstract class.

```typescript
import { HttpResponseMethodNotAllowed } from '@foal/common';
import {
  ServiceControllerFactory,
  HttpResponseMethodNotAllowed,
  HttpResponseOK,
  Route
} from '@foal/core';

import { MyService } from '../services';

export interface Options {
  addFive?: boolean;
}

export type RouteName = 'my-route-name' | 'my-route-name2';

export class MyControllerFactory extends ServiceControllerFactory<
    MyService, RouteName, Options
  > {

  protected defineController(controller: Controller<RouteName>,
                          ServiceClass: Class<IService>,
                          options: Options = {}): void {
    controller.addRoute('my-route-name', 'GET', '/', () => {
      if (options.addFive) {
        return new HttpResponseOK(service.giveMeANumber(5, 10) + 5);
      }
      return new HttpResponseOK(service.giveMeANumber(5, 10));
    });
    controller.addRoute('my-route-name2', 'POST', '/', () => new HttpResponseMethodNotAllowed());
  }

}

export const myControllerFactory = new MyControllerFactory();
```