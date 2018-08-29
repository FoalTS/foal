# Create and Run Scripts

Sometimes we have to execute some tasks from the command line. These tasks can serve different purpose such as populating a database (user creation, etc) for instance. They often need to access some of the app classes and functions. This is where shell scripts come into play.

# Create Scripts

A shell script is just a TypeScript file which is called from the command line.

They are located in the `src/scripts` directory. Let's create one: `src/scripts/display-users.ts`

# Write Scripts

Usually a script has a `main` function which is called directly in the file. This lets you easily use async/await keywords when dealing with asynchronous code.

From this file you can import the classes and functions of your app and use them. You can also create a database connection based on the database configuration of your app.

Let's take an example: a script that displays the users stored in the database.

```typescript
// 3p
import { createConnection } from 'typeorm';

// App
import { User } from './app/entities';

async function main() {
  const connection = await createConnection();
  const users = await connection.getRepository(User).find();
  console.log(users);
}

main();
```


# Build and Run Scripts

To run a script you first need  to build it.

```sh
npm run build
```

Then you can run it with this command:

```sh
node lib/scripts/my-script.js
```