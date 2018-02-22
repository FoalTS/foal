# Modules

Every app starts with a module. A module instantiates services and binds controllers to the request handler. It may also have pre-hooks (or post-hooks) executed before (or after) every controller.

## Example

```typescript
import { rest } from '@foal/common';
import { FoalModule } from '@foal/core';
// module and service imports...

const AppModule: FoaModule = {
  controllers: [
    rest.attachService('/my_resources', MyModelService)
  ],
  hooks: [
    myFirstPreHook(),
    mySecondPreHook(),
    myPostHook()
  ]
}
```

## Nested modules

When your app grows up, you may be interested in splitting your app into several modules. Here's an example on how to embed your modules:

```typescript
const Module1: FoalModule = {
  controllers: [
    rest.attachService('/my_resources', MyModelService)
  ]
};

const Module2: FoalModule = {
  controllers: [
    rest.attachService('/my_resources2', MyModelService2)
  ]
};

const AppModule: FoalModule = {
  controllers: [
    rest.attachService('/my_resources3', MyModelService3)
  ],
  modules: [
    { module: Module1 }
    { module: Module2, path: '/foo' },
  ]
}

/**
 * The app serves three REST endpoints:
 * - /my_resources3
 * - /my_resources
 * - /foo/my_resources2
 */
```

Each service is instanciated per module. If you want to share the same instance of a service accross multiple modules, you must specify the service class in the `services` property of a parent module.

```typescript
const Module1: FoalModule = {
  controllers: [
    rest.attachService('/my_resources', MySharedModelService)
  ]
};

const Module2: FoalModule = {
  controllers: [
    rest.attachService('/my_resources2', MySharedModelService)
  ]
};

const AppModule: FoalModule = {
  modules: [
    { module: Module1 }
    { module: Module2, path: '/foo' },
  ],
  services: [ MySharedModelService ]
}
```