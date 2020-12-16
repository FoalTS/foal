---
title: The Shell Scripts
---

Like in the previous tutorial, you are going to use shell scripts to populate the database.

## The `create-user` script

A script called `create-user` already exists in the `scripts/` directory. It has a lot of commented lines that let you create users with *permissions* and *groups*.

Open the file and replace its content with the following:

```typescript
// 3p
import { isCommon } from '@foal/password';
import { createConnection } from 'typeorm';

// App
import { User } from '../app/entities';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string; password: string }) {
  const connection = await createConnection();
  try {
    const user = new User();
    user.email = args.email;

    if (await isCommon(args.password)) {
      console.log('This password is too common. Please choose another one.');
      return;
    }
    await user.setPassword(args.password);

    console.log(
      await connection.manager.save(user)
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

Some parts of this code should look familiar.

The `schema` object is used to validate the arguments typed in the command line. In that case, the script defines two required parameters: an email and a password. The `format` property checks that the `email` string is really an email (presence of the `@` character, etc). 

The `main` function is divided in several parts. First it instanciates a connection to the database. Then, it creates a new user with the arguments specified in the command line. The `isCommon` function compares the given password with a list of ten thousands common passwords (ex: `123456`, `password`, etc). It returns true if it is found in the list. Finally the user is saved in the database and, if an error is thrown, the error message is pretty printed.

As you may have noticed, the `isCommon` utility comes from the `@foal/password` package. You have to install it.

```
npm install @foal/password
```

Now build the script.

```
npm run build:scripts
```

Create two new users.

```
foal run create-user email="john@foalts.org" password="john_password"
foal run create-user email="mary@foalts.org" password="mary_password"
```

> If you try to re-run one of these commands, you'll get the error below as the email key is unique.
> `SQLITE_CONSTRAINT: UNIQUE constraint failed: user.email`

## The `create-todo` script

The `create-todo` script is a bit more complex as `Todo` has a many-to-one relation with `User`.

Open the `create-todo.ts` file and replace its content.

```typescript
// 3p
import { createConnection } from 'typeorm';

// App
import { Todo, User } from '../app/entities';

export const schema = {
  properties: {
    owner: { type: 'string', format: 'email' },
    text: { type: 'string' },
  },
  required: [ 'owner', 'text' ],
  type: 'object',
};

export async function main(args: { owner: string; text: string }) {
  const connection = await createConnection();
  try {
    const user = await connection.getRepository(User).findOne({ email: args.owner });

    if (!user) {
      console.log('No user was found with the email ' + args.owner);
      return;
    }

    const todo = new Todo();
    todo.text = args.text;
    todo.owner = user;

    console.log(
      await connection.manager.save(todo)
    );
  } catch (error) {
    console.log(error.message);
  } finally {
    await connection.close();
  }
}

```

We added an `owner` parameter to know which user the todo belongs to. It expects the email of the user.

The `main` function then tries to get the user who has this email. If he or she does not exist, then the script terminates with a message displayed in the console. If not, the user is added to the todo as her/his owner.

Build the script.

```
npm run build:scripts
```

Create new todos for each user.

```
foal run create-todo owner="john@foalts.org" text="John task 1"
foal run create-todo owner="john@foalts.org" text="John task 2"
foal run create-todo owner="mary@foalts.org" text="Mary task 1"
foal run create-todo owner="mary@foalts.org" text="Mary task 2"
```
