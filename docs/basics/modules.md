# Modules

// Add a little get-started (some code or a cli command)

```sh
foal generate module my-module
```

```typescript
import { Module, IModule, PermissionRequired } from '@foal/core';

import { MyController } from './controllers/my-controller';

@Module()
@PermissionRequired('admin-permission')
export class MyModule implements IModule {
  controllers = [
    controller('/my-controller', MyController)
  ];
}
```

Modules can be seen as controller groups. Every app consists of at least one module usualy called the `AppModule`.

Every app starts with a module. A module binds the controllers to the request handler. It may have hooks executed before every controller.

```typescript
interface IModule {
  controllers?: Class[];
  subModules?: Class<IModule>[];
}
```

## Controllers

## Entities

## SubModules

## Hook

like controllers or methods

## Example

```typescript
import { controller, IModule, Module, rest } from '@foal/core';
// module and service imports...

@Module()
@MyFirstHook()
@MySecondHook()
export class AppModule implements IModule {
  controllers  = [
    controller('/my_resources', MyController)
  ];
}
```

## Sub-modules

When your app grows up, you may be interested in splitting your app into several modules (authentication, admin, home, public, etc). Here's an example on how to embed your modules:

```typescript
@Module()
class Module1 implements IModule {
  controllers  = [
    controller('/my_resources', MyController)
  ];
};

@Module()
class Module2 implements IModule {
  controllers  = [
    controller('/my_resources2', MyController2)
  ];
};

@Module()
class AppModule implements IModule {
  controllers = [
    controller('/my_resources3', MyController3)
  ];

  subModules = [
    subModule('', Module1),
    subModule('/foo', Module2),
  ];
}

/**
 * The app serves three REST endpoints:
 * - /my_resources3
 * - /my_resources
 * - /foo/my_resources2
 */
```
