---
title: Initialisation
---


In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database.

There are two ways to achieve this in FoalTS.

## Initializing the Application

The first approach is to add an `init` method to the root controller class which will be called before the application is fully created. This method can be synchronous or asynchronous.

*Example 1*
```typescript
import { dependency } from '@foal/core';

import { ServiceA } from '../services';

export class AppController {

  @dependency
  serviceA: ServiceA;

  async init() {
    await this.serviceA.doSomething();
  }

}
```

## Initializing a Service

The second approach is to add a `boot` method in your services. This method can be synchronous or asynchronous.

*Example*
```typescript
export class ServiceA {

  async boot() {
    await doSomething();
  }

}
```

Boot methods are executed before `AppController.init` gets called.

> If you manually inject services to your service manager and you want their `boot` methods to be called, you must specify this in the `set` method options.
> 
> ```typescript
> const serviceManager = new ServiceManager();
> serviceManager.set(ServiceA, myServiceInstance, { boot: true });
> ```

## Best Practices

If your initialization consists of several asynchronous tasks, you may want to perform them in *parallel*. This will reduce the initialization time, which has an impact if you use a serverless architecture.

```typescript
export class AppController {

  async init() {
    // Don't do
    await createConnection();
    await createAnotherConnection();

    // Do
    await Promise.all([
      createConnection(),
      createAnotherConnection()
    ])
  }

}
```
