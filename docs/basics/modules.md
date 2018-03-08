# Modules

Every app starts with a module. A module binds the controllers to the request handler. It may have pre-hooks (or post-hooks) executed before (or after) every controller.

## Example

```typescript
import { rest } from '@foal/common';
import { Module } from '@foal/core';
// module and service imports...

const AppModule: Module = {
  controllers: [
    rest.attachService('/my_resources', MyModelService)
  ],
  preHooks: [
    myFirstPreHook(),
    mySecondPreHook(),
  ],
  postHooks: [
    myPostHook()
  ]
}
```

## Nested modules

When your app grows up, you may be interested in splitting your app into several modules (authentication, admin, home, public, etc). Here's an example on how to embed your modules:

```typescript
const Module1: Module = {
  controllers: [
    rest.attachService('/my_resources', MyModelService)
  ]
};

const Module2: Module = {
  path: '/foo',
  controllers: [
    rest.attachService('/my_resources2', MyModelService2)
  ]
};

const AppModule: Module = {
  controllers: [
    rest.attachService('/my_resources3', MyModelService3)
  ],
  modules: [
    Module1,
    Module2,
  ]
}

/**
 * The app serves three REST endpoints:
 * - /my_resources3
 * - /my_resources
 * - /foo/my_resources2
 */
```
