---
title: The Shell Script create-todo
id: tuto-4-the-shell-script-create-todo
slug: 4-the-shell-script-create-todo
---

Now it is time to populate the database with some tasks.

You could run the command line interface of your database (in that case *SQLite*) and enter some SQL queries. But this is risky and not very handy. It becomes especially true when the complexity of your models increases (relations many-to-many, etc).

That's why you are going to create and use a *shell script* instead.

```sh
npx foal generate script create-todo
```

A *shell script* is a piece of code intended to be called from the command line. It has access to all the components of your application, including your models. A shell script is divided in two parts:

- a `schema` object which defines the specification of the command line arguments,
- and a `main` function which gets these arguments as an object and executes some code.

Open the new generated file in the `src/scripts` directory and update its content.

```typescript
// 3p
import { Logger, ServiceManager } from '@foal/core';

// App
import { Todo } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  properties: {
    text: { type: 'string' }
  },
  required: [ 'text' ],
  type: 'object',
};

export async function main(args: { text: string }, services: ServiceManager, logger: Logger) {
  // Connect to the database.
  await dataSource.initialize();

  try {
    // Create a new task with the text given in the command line.
    const todo = new Todo();
    todo.text = args.text;

    // Save the task in the database and then display it in the console.
    await todo.save();

    logger.info(`Todo created: ${JSON.stringify(todo, null, 2)}`);
  } finally {
    // Close the connection to the database.
    await dataSource.destroy();
  }
}

```

Build the script.

```sh
npm run build
```

Then run the script to create tasks in the database.

```sh
npx foal run create-todo text="Read the docs"
npx foal run create-todo text="Create my first application"
npx foal run create-todo text="Write tests"
```

> Note that if you try to create a new to-do without specifying the text argument, you'll get the error below.
>
> `Script error: arguments must have required property 'text'.`
