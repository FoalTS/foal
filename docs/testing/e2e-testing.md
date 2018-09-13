# E2E Testing

End-to-end tests are located in the `src/e2e` directory.

## Write, Build and Run E2E Tests

- `npm run e2e` - Build the e2e tests code and execute them. If a file changes then the code is rebuilt and the tests are executed again. This is usually **the only command that you need during development**.
- `npm run build:e2e` - Build the e2e tests code (compile the typescript files and copy the templates).
- `npm run build:e2e:w` - Build the e2e tests code (compile the typescript files and copy the templates) and do it again whenever a file changes (watch mode).
- `npm run start:e2e` - Execute the e2e tests from the built files.
- `npm run start:e2e:w` - Execute the e2e tests from the built files and do it again whenever one of these files changes (watch mode).

## The `SuperTest` library

You can use [the SuperTest library](https://github.com/visionmedia/supertest) to write your e2e tests. It is installed by default.

*Example:*
```typescript
// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

// App
import { AppModule } from '../app/app.module';

describe('The server', () => {

  let app;

  before(async () => {
    await createConnection();
    app = createApp(AppModule);
  });

  after(() => getConnection().close());

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

```
