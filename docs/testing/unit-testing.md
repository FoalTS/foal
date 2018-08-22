# Unit testing

FoalTS uses dependency injection to keep the code loosely coupled and so enhance testatibility.

## Services

## Controllers

```typescript
// std
import { ok } from 'assert';

//3p
import { Controller, createController, Service } from '@foal/core';

@Service()
class MyService {

}

@Controller()
class MyController {
  constructor(public myService: MyService) {}
}

const controller = createController(MyController);
ok(controller.myService instanceof MyService);
```

## Hooks

`getHookFunction` util.

## Templates
