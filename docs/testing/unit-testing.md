# Unit testing
// Add a little get-started (some code or a cli command)
All tests must be imported in the main `test.ts` file.

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