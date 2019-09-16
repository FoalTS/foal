# Initialization

In many situations, we need to initialize the application (i.e perform certain actions) before listening to incoming HTTP requests. This is the case, for example, if you need to establish a connection to the database.

There are two ways to achieve this in FoalTS.

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

Sometimes, however, this approach is not sufficient because we need to call the methods of some services. In this case, you can add an `init` method to the root controller class that will be called before the application is fully created. This method can be synchronous or asynchronous.

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

## Best Practices

If your initialization consists of several asynchronous tasks, you may want to perform them in *parallel*. This will reduce the initialization time, which has a real impact if you use a serverless architecture.

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
