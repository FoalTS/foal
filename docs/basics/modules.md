# Modules

Every app starts with a module. A module instantiates services and binds controllers to the request handler. It may import other ones. They're espacially interesting when a project grows up.

## Example

```typescript
import { Module, rest } from '@foal/core';
// module and service imports ...

const AppModule: Module = {
  services: [ MyService1, MyService2, MyController ],
  controllerBindings: [
    rest.bindController('/my_controller', MyController)
  ],
  imports: [
    { module: MyModule }
    { module: Team1Module, path: '/team1' },
    { module: Team2Module, path: '/team2' },
  ]
}
```

## Dependencies

![Schema](./module-dependencies.png)