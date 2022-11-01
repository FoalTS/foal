---
title: Unit Testing
id: tuto-7-unit-testing
slug: 7-unit-testing
---

The last step of this tutorial is to add some unit tests to the `ApiController`.

A unit test file ends with the `spec.ts` extension and is usually placed next to the file it is testing.

Open the file `api.controller.spec.ts` and replace its content.

```typescript
// std
// The `assert` module provides a simple set of assertion tests.
import { ok, strictEqual } from 'assert';

// 3p
import { createController, getHttpMethod, getPath, isHttpResponseOK } from '@foal/core';
import { DataSource } from 'typeorm';

// App
import { Todo } from '../entities';
import { ApiController } from './api.controller';
import { createDataSource } from '../../db';

// Define a group of tests.
describe('ApiController', () => {

  let dataSource: DataSource;
  let controller: ApiController;

  // Create a connection to the database before running all the tests.
  before(async () => {
    // The connection uses the configuration defined in the file config/test.json.
    // By default, the file has three connection options:
    // - "database": "./test_db.sqlite3" -> Use a different database for running the tests.
    // - "synchronize": true ->  Auto create the database schema when the connection is established.
    // - "dropSchema": true -> Drop the schema when the connection is established (empty the database).
    dataSource = createDataSource();
    await dataSource.initialize();
  });

  // Close the database connection after running all the tests whether they succeed or failed.
  after(async () => {
    if (dataSource) {
      await dataSource.close();
    }
  });

  // Create or re-create the controller before each test.
  beforeEach(() => controller = createController(ApiController));

  // Define a nested group of tests.
  describe('has a "getTodos" method that', () => {

    // Define a unit test.
    it('should handle requests at GET /todos.', () => {
      // Throw an error and make the test fail if the HTTP method of `getTodos` is not GET.
      strictEqual(getHttpMethod(ApiController, 'getTodos'), 'GET');
      // Throw an error and make the test fail if the path of `getTodos` is not /todos.
      strictEqual(getPath(ApiController, 'getTodos'), '/todos');
    });

    // Define a unit test.
    it('should return an HttpResponseOK.', async () => {
      // Create fake todos.
      const todo1 = new Todo();
      todo1.text = 'Todo 1';

      const todo2 = new Todo();
      todo2.text = 'Todo 2';

      // Save the todos.
      await Todo.save([ todo1, todo2 ]);

      const response = await controller.getTodos();
      ok(isHttpResponseOK(response), 'response should be an instance of HttpResponseOK.');

      const body = response.body;

      ok(Array.isArray(body), 'The body of the response should be an array.');
      strictEqual(body[0].text, 'Todo 1');
      strictEqual(body[1].text, 'Todo 2');
    });

  });

});

```

> As a controller method returns an `HttpResponse` object, it is really easy to test the status and body of the response.


> If the controller method takes a `Context` object as argument, you can instantiate one like this: `new Context({ /* content of the express request object */})`.

Run the tests.

```
npm run test
```

> This command watches at your tests and tested files in the `app/` and `scripts/` directories. When a file is modified, it automatically recompiles and re-runs your tests.

You should now end up with this output:

![Unit tests output](./unit-tests-output.png)

Congratulations! You have reached the end of this tutorial!

If you have any questions, feel free to open an issue on Github!

> The entire source code is available [here](https://foalts.org/simple-todo-list-source-code-v3.zip).