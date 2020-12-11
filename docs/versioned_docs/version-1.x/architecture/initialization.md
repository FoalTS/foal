---
title: Initialization
---

In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database.

There are three ways to achieve this in FoalTS.

## The `main` function

The most straightforward way to do it, which is used by default, is to add the initialization commands in the `main` function before `createApp` is called.

If your application uses TypeORM, your project should have a file `src/index.ts` that looks like this:

```typescript
async function main() {
  // Initialization
  await createConnection();

  // Creation of the application
  const app = createApp(AppController);

  // ...
}

main();
```

## The `AppController.init` method

Sometimes, however, this approach is not sufficient because we need to call the methods of some services. In this case, you can add an `init` method to the root controller class which will be called before the application is fully created. This method can be synchronous or asynchronous.

*Example 1*
```typescript
export class AppController {

  @dependency
  serviceA: ServiceA;

  async init() {
    await this.serviceA.doSomething();
  }

}
```

*Example 2*
```typescript
export class AppController {

  @dependency
  serviceA: ServiceA;

  @dependency
  serviceB: ServiceB;

  async init() {
    this.serviceA.init();
    this.serviceB.init();
  }

}
```

For this to work, you need to update your `src/index.ts` file and create the application with the asynchronous function `createAndInitApp`.

```typescript
import { createAndInitApp } from '@foal/core';

async function main() {
  const app = await createAndInitApp(AppController);

  // ...
}

main();
```

## The services `boot` method

> `boot` methods are available in v1.8.0 onwards.

Alternatively you can add a `boot` method in your services. This method can be synchronous or asynchronous.

*Example*
```typescript
export class ServiceA {

  async boot() {
    await doSomething();
  }

}
```

Then, you have to call the `boot` method of your service manager (it will be automatically called starting from version 2).

```typescript
import { createAndInitApp } from '@foal/core';

async function main() {
  const serviceManager = new ServiceManager();
  const app = createApp(AppController, {
    serviceManager
  });
  // This line calls the `boot` method of all your services that have one.
  await serviceManager.boot();

  // ...
}

main();
```

If you manually inject services to your service manager and you want their `boot` methods to be called, you must specify this in the `set` method options.

```typescript
const serviceManager = new ServiceManager();
serviceManager.set(ServiceA, myServiceInstance, { boot: true })
```

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
