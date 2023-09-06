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

```shell
npm run build:e2e # Build the e2e tests code (compile the typescript files and copy the templates)
npm run start:e2e # Execute the e2e tests from the built files
```

These commands are particularly useful when you want to integrate your tests into a CI pipeline or a Git hook.

## The `SuperTest` library

You can use [the SuperTest library](https://github.com/visionmedia/supertest) to write your e2e tests. It is installed by default.

*Simple example*
```typescript
// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

// App
import { AppController } from '../app/app.controller';
import { createDataSource } from '../db';

describe('The server', () => {

  let app;
  let dataSource: DataSource;

  before(async () => {
    app = await createApp(AppController);
    dataSource = createDataSource();
    await dataSource.initialize();
  });

  after(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  it('should return a 200 status on GET / requests.', () => {
    return request(app)
      .get('/')
      .expect(200);
  });

});

```

*Advanced example*
```typescript
// std
// The `assert` module provides a simple set of assertion tests.
import { ok } from 'assert';

// 3p
import { createApp } from '@foal/core';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

// App
import { AppController } from '../app/app.controller';
import { User } from '../app/entities';
import { createDataSource } from '../db';

// Define a group of tests.
describe('The server', () => {

  let dataSource: DataSource;
  let app: any;

  // Create the application and the connection to the database before running all the tests.
  before(async () => {
    app = await createApp(AppController);
    dataSource = createDataSource();
    await dataSource.initialize();
  });

  // Close the database connection after running all the tests whether they succeed or failed.
  after(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  // Define a nested group of tests.
  describe('on GET /api/todos requests', () => {

    it('should return a 401 status if the user did not signed in.', () => {
      return request(app)
        .get('/api/todos')
        .expect(401);
    });

    it('should return a 200 status if the user did signed in.', async () => {
      // Create a new user in the empty database.
      const user = new User();
      user.email = 'john@foalts.org';
      await user.setPassword('john_password');
      await user.save();

      // Log the user in.
      let cookie = '';
      await request(app)
        .post('/auth/login')
        // Set the body of the request
        .send({ email: 'john@foalts.org', password: 'john_password' })
        // The response should have the status 302 (redirection)
        .expect(302)
        .then(data => {
          // The response should set the authentication cookie for the next requests.
          ok(Array.isArray(data.header['set-cookie']));
          // Save the cookie to be able to use it in further requests.
          cookie = data.header['set-cookie'][0];
        });

      // Test the /api/todos endpoint when the user has logged in.
      return request(app)
        .get('/api/todos')
        // Send the authentication cookie.
        .set('Cookie', cookie)
        .expect(200);
    });

  });

});
```