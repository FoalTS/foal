# Create and Run Scripts

Sometimes we have to execute some tasks from the command line. These tasks can serve different purposes such as populating a database (user creation, etc) for instance. They often need to access some of the app classes and functions. This is when shell scripts come into play.

# Create Scripts

A shell script is just a TypeScript file located in the `src/scripts`. It must export a `main` function that is then called when running the script.

Let's create a new one with the command line: `foal g script display-users`. A new file with a default template should appear in you `src/scripts` directory.

# Write Scripts

Remove the content of `src/scripts/display-users.ts` and replace it with the below code.

```typescript
// 3p
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export async function main() {
  const connection = await createConnection();
  const users = await connection.getRepository(User).find();
  console.log(users);
}

```

As you can see, we can easily establish a connection to the database in the script as well as import some of the app components (the `User` in this case).

Encapsulating your code in a `main` function without calling it directly in the file has several benefits:
- You can import and test your `main` function in a separate file.
- Using a function lets you easily use async/await keywords when dealing with asynchronous code.

# Build and Run Scripts

To run a script you first need to build it.

```sh
npm run build:scripts
```

Then you can execute it with this command:

```sh
foal run my-script # or foal run-script my-script
```

> You can also provide additionnal arguments to your script (for example: `foal run my-script foo=1 bar='[ 3, 4 ]'`). The default template in the generated scripts shows you how to handle such behavior.
