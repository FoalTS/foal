# Controller factories

Controller factories are objects that create controllers from services or functions. They should be the only way to create them.

## The `basic` controller factory

`basic` is a low-level controller factory. It should only serve special cases. Prefer using the service controller factories below.

See [Controllers](../basics/controllers.md) to learn how to use it.

## The service controller factories

`ServiceControllerFactory` is an abstract class from `@foal/core` that aims to create controller factories. All classes inheriting it have a public method `attachService` that instantiates the controllers and implement a protected method `defineController`.

> In `@foal/common`, `rest`, `view`, `multipleViews` are singletons of classes inheriting the `ServiceControllerFactory`.

Let's see how to create one.

First define the interface of the services that can be "attached" by your controller-factory. For example:

```typescript
interface MyService {
  giveMeANumber(start: number, end: number): number;
}
```

Then create your controller factory from the `ServiceControllerFactory` abstract class.

```typescript
import { HttpResponseMethodNotAllowed } from '@foal/common';
import {
  ServiceControllerFactory,
  HttpResponseMethodNotAllowed,
  HttpResponseOK,
  Route
} from '@foal/core';

import { MyService } from '../services';

// Options are not mandatory. They can be used to pass
// more information to the `attachService`.
export interface Options {
  addFive?: boolean;
}

// Each route in a controller has a name to be easily retreived
// when registering pre and post hooks.
export type RouteName = 'my-route-name' | 'my-route-name2';

export class MyControllerFactory extends ServiceControllerFactory<
    MyService, RouteName, Options
  > {

  protected defineController(controller: Controller<RouteName>,
                             ServiceClass: Class<IService>,
                             options: Options = {}): void {
    controller.addRoute('my-route-name', 'GET', '/', (ctx, services) => {
      // We return here directly an HttpResponse but we could also
      // return a resolved promise with an HttpResponse.
      if (options.addFive) {
        return new HttpResponseOK(services.get(ServiceClass).giveMeANumber(5, 10) + 5);
      }
      return new HttpResponseOK(service.get(ServiceClass).giveMeANumber(5, 10));
    });
    controller.addRoute('my-route-name2', 'POST', '/', () => new HttpResponseMethodNotAllowed());
  }

}

// Do not forget this line. A controller factory is an instance of the class, not the class itself.
export const myControllerFactory = new MyControllerFactory();
```

Now let's use it.

```typescript
import { Module, Service } from '@foal/core';

import { myControllerFactory } from './my.controller-factory';
import { MyService } from './my-service.interface';

@Service()
class ServiceA implements MyService {
  constructor() {}

  public giveMeANumber(start: number, end: number): number {
    return (start + end) / 2;
  }
}

const AppModule: Module = {
  controllers: [
    myControllerFactory
      .attachService('/foo', ServiceA),
    myControllerFactory
      .attachService('/bar', ServiceA, {
        addFive: true
      })
  ]
}
```