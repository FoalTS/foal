# Unit Testing

## Write, Build and Run Tests

```sh
npm run build:test # Build the test code (compile the typescript files and copy the templates).
npm run build:test:w # Build the test code (compile the typescript files and copy the templates) and do it again whenever a file changes (watch mode).
npm run start:test # Execute the tests from the built files.
npm run start:test:w # Execute the tests from the built files and do it again whenever one of these files changes (watch mode).
npm run test # Build the test code and execute the tests. If a file changes then the code is rebuilt and the tests are executed again.
```

## Testing Controllers and Services

```typescript
// std
import { ok } from 'assert';

// 3p
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

## Dependency Injection and Unit Testing

FoalTS uses dependency injection to keep the code loosely coupled and so enhance testatibility.

## Testing Hooks

`getHookFunction` util.
