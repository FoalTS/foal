# Unit Testing

## Convention

Every unit test file should be placed next to the file it tests with the same name and the `.spec.ts` extension. If this extension is not present then the file won't be executed when running the test commands.

*Example:*
```
'- services
  |- my-service.service.ts
  '- my-service.service.spec.ts
```

## Write, Build and Run Unit Tests

- `npm run test` - Build the unit tests code and execute them. If a file changes then the code is rebuilt and the tests are executed again. This is usually **the only command that you need during development**.
- `npm run build:test` - Build the unit tests code (compile the typescript files and copy the templates).
- `npm run build:test:w` - Build the unit tests code (compile the typescript files and copy the templates) and do it again whenever a file changes (watch mode).
- `npm run start:test` - Execute the unit tests from the built files.
- `npm run start:test:w` - Execute the unit tests from the built files and do it again whenever one of these files changes (watch mode).


## Testing Controllers and Services

```typescript
// std
import { ok } from 'assert';

// 3p
import { Controller, createController } from '@foal/core';

class MyService {

}

@Controller()
class MyController {
  constructor(public myService: MyService) {}
}

const controller = createController(MyController);
ok(controller.myService instanceof MyService);
```

## Dependency Injection and Unit Testing

FoalTS uses dependency injection to keep the code loosely coupled and so enhance testatibility.

## Testing Hooks

`getHookFunction` util.
