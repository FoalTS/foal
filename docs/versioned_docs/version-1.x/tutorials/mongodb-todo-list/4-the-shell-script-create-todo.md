---
title: The Shell Script create-todo
---

Now it is time to populate the database with some tasks.

You could run the command line interface of your database and enter some MongoDB queries. But this is risky and not very handy. It becomes especially true when the complexity of your models increases.

That's why you are going to create and use a *shell script* instead.

```sh
foal generate script create-todo
```

A *shell script* is a piece of code intended to be called from the command line. It has access to all the components of your application, including your models. A shell script is divided in two parts:

- a `schema` object which defines the specification of the command line arguments,
- and a `main` function which gets these arguments as an object and executes some code.

Open the new generated file in the `src/scripts` directory and update its content.

```typescript
// 3p
import { Config } from '@foal/core';
import { connect, disconnect } from 'mongoose';

// App
import { Todo } from '../app/models';

export const schema = {
  properties: {
    text: { type: 'string' }
  },
  required: [ 'text' ],
  type: 'object',
};

export async function main(args: { text: string }) {
  // Create a new connection to the database.
  const uri = Config.getOrThrow('mongodb.uri', 'string');
  connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true });

  // Create a new task with the text given in the command line.
  const todo = new Todo();
  todo.text = args.text;

  try {
  // Save the task in the database and then display it in the console.
    console.log(
      await todo.save()
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    // Close the connection to the database.
    disconnect();
  }
}

```

Build the script.

```sh
npm run build:scripts
```

Then run the script to create tasks in the database.

```sh
foal run create-todo text="Read the docs"
foal run create-todo text="Create my first application"
foal run create-todo text="Write tests"
```

> Note that if you try to create a new to-do without specifying the text argument, you'll get the error below.
>
> `Error: The command line arguments should have required property 'text'.`