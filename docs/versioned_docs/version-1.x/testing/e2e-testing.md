---
title: E2E Testing
---

End-to-end tests are located in the `src/e2e` directory.

## Build and Run E2E Tests

### Watch mode (for development)

```
npm run e2e
```

This command builds and executes the e2e tests. If you modify a file and save it, the code is rebuilt and the tests are run again. This is particularly useful in development: you do not need to re-run the command every time you make code changes.

The process runs forever until you stop it.

### Simple mode (for CI and Git hooks)

If you need to build and run the tests only once, you can use these two commands:

```sh
npm run build:e2e # Build the e2e tests code (compile the typescript files and copy the templates)
npm run start:e2e # Execute the e2e tests from the built files
```

These commands are particularly useful when you want to integrate your tests into a CI pipeline or a Git hook.

## The `SuperTest` library

You can use [the SuperTest library](https://github.com/visionmedia/supertest) to write your e2e tests. It is installed by default.

*Example:*
```typescript
// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

// App
import { AppController } from '../app/app.controller';

describe('The server', () => {

  let app;

  before(async () => {
    await createConnection();
    app = createApp(AppController);
  });

  after(() => getConnection().close());

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

```
