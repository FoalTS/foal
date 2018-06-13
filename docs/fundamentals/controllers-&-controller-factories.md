# Controller factories

Controller factories are objects that create controllers from services or functions. They should be the only way to create them.

You'll find in [this page]() the common controller factories provided by FoalTS.

First define the interface of the services that can be "attached" by your controller-factory. For example:

```typescript
interface MyService {
  giveMeANumber(start: number, end: number): number;
}
```

Then create your controller factory from the `IServiceControllerFactory` interface.

```typescript
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

class MyController extends Controller<keyof MyController> {
  constructor(private ServiceClass: Class<IService>) {
    super(path)
  }

  @Get('/')
  myRouteName(ctx, services) {
    if (options.addFive) {
      return new HttpResponseOK(services.get(ServiceClass).giveMeANumber(5, 10) + 5);
    }
    return new HttpResponseOK(service.get(ServiceClass).giveMeANumber(5, 10));
  }

  @Post('/')
  myRouteName(ctx, services) {
    return new HttpResponseMethodNotAllowed()
  }
}

export function myControllerFactory(path: string, ServiceClass: Class<IService>): MyController {
  return new MyController(path, ServiceClass);
} 
```

Now let's use it.

```typescript
import { Module, Service } from '@foal/core';

import { myControllerFactory } from './my.controller-factory';
import { MyService } from './my-service.interface';

@Service()
class ServiceA implements MyService {
  giveMeANumber(start: number, end: number): number {
    return (start + end) / 2;
  }
}

const AppModule: Module = {
  controllers: [
    myControllerFactory('/foo', ServiceA),
    myControllerFactory('/bar', ServiceA, {
      addFive: true
    })
  ]
}
```