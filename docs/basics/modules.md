# Modules

// Add a little get-started (some code or a cli command)

// Modules can be seen as controller groups.

Every app starts with a module. A module binds the controllers to the request handler. It may have pre-hooks (or post-hooks) executed before (or after) every controller.

```typescript
interface Module {
  controllers?: Controller<string>[];
  models?: Class[];
  modules?: Module[];
  path?: string;
  postHooks?: PostHook[];
  preHooks?: PreHook[];
}
```

## Example

```typescript
import { Module , rest } from '@foal/core';
// module and service imports...

const AppModule: Module = {
  controllers: [
    rest('/my_resources', MyModelService)
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
    rest('/my_resources', MyModelService)
  ]
};

const Module2: Module = {
  path: '/foo',
  controllers: [
    rest('/my_resources2', MyModelService2)
  ]
};

const AppModule: Module = {
  controllers: [
    rest('/my_resources3', MyModelService3)
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
