# E2E Testing and Authentication

The last part of this tutorial explains how to write and run *end-to-end* tests. The purpose of these tests is not to verify that each feature of each component works, but to check that these components work properly together.

The tests are located in the `src/e2e/` directory. The command to run them in development is `npm run e2e`. E2E tests generally use the `supertest` library which provides a high-level abstraction for testing HTTP.

Open `index.ts` in `src/e2e` and replace its content.

```typescript
// std
// The `assert` module provides a simple set of assertion tests.
import { ok } from 'assert';

// 3p
import { createApp } from '@foal/core';
import { Group, Permission } from '@foal/typeorm';
import * as request from 'supertest';
import { createConnection, getConnection } from 'typeorm';

// App
import { AppController } from '../app/app.controller';
import { Todo, User } from '../app/entities';

// Define a group of tests.
describe('The server', () => {

  let app;

  // Create the application and the connection to the database before running all the tests.
  before(async () => {
    await createConnection({
      // Choose a test database. You don't want to run your tests on your production data.
      database: 'e2e_db.sqlite3',
      // Drop the schema when the connection is established.
      dropSchema: true,
      // Register the models that are used.
      entities: [User, Permission, Group, Todo],
      // Auto create the database schema.
      synchronize: true,
      // Specify the type of database.
      type: 'sqlite',
    });
    app = createApp(AppController);
  });

  // Close the database connection after running all the tests whether they succeed or failed.
  after(() => getConnection().close());

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
      await getConnection().manager.save(user);

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

Now run the tests.

```
npm run e2e
```

The output should look like this:

![E2E tests output](./e2e_output.png)

Congratulations, you have reached the end of this tutorial!