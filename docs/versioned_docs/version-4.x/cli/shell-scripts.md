---
title: Shell Scripts
---


Sometimes we have to execute some tasks from the command line. These tasks can serve different purposes such as populating a database (user creation, etc) for instance. They often need to access some of the app classes and functions. This is when shell scripts come into play.

## Create Scripts

A shell script is just a TypeScript file located in the `src/scripts`. It must export a `main` function that is then called when running the script.

Let's create a new one with the command line: `npx foal g script display-users`. A new file with a default template should appear in you `src/scripts` directory.

## Write Scripts

Remove the content of `src/scripts/display-users.ts` and replace it with the code below.

```typescript
// 3p
import { createService } from '@foal/core';

// App
import { dataSource } from '../db';
import { User } from '../app/entities';
import { Logger } from '../app/services';

export async function main() {
  await dataSource.initialize();

  try {
    const users = await User.find();
    const logger = createService(Logger);
    logger.log(users);
  } finally {
    dataSource.destroy();
  }
}

```

As you can see, we can easily establish a connection to the database in the script as well as import some of the app components (the `User` in this case).

Encapsulating your code in a `main` function without calling it directly in the file has several benefits:
- You can import and test your `main` function in a separate file.
- Using a function lets you easily use async/await keywords when dealing with asynchronous code.

## Build and Run Scripts

To run a script you first need to build it.

```sh
npm run build
```

Then you can execute it with this command:

```shell
npx foal run my-script # or npx foal run-script my-script
```

> You can also provide additionnal arguments to your script (for example: `npx foal run my-script foo=1 bar='[ 3, 4 ]'`). The default template in the generated scripts shows you how to handle such behavior.

> If you want your script to recompile each time you save the file, you can run `npm run dev` in a separate terminal.
