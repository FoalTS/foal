---
title: The Shell Scripts
id: tuto-4-the-shell-scripts
slug: 4-the-shell-scripts
---

Your models are ready to be used. As in the previous tutorial, you will use shell scripts to feed the database.

## The `create-user` script

A script called `create-user` already exists in the `scripts` directory.

Open the file and replace its content with the following:

```typescript
// 3p
import { hashPassword, Logger, ServiceManager } from '@foal/core';

// App
import { User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email', maxLength: 255 },
    password: { type: 'string' },
    name: { type: 'string', maxLength: 255 },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: { email: string, password: string, name?: string }, services: ServiceManager, logger: Logger) {
  const user = new User();
  user.email = args.email;
  user.password = await hashPassword(args.password);
  user.name = args.name ?? 'Unknown';
  user.avatar = '';

  await dataSource.initialize();

  try {
    await user.save();

    logger.info(`User created: ${user.id}`);
  } finally {
    await dataSource.destroy();
  }
}

```

Some parts of this code should look familiar to you.

The `schema` object is used to validate the arguments typed on the command line. In this case, the script expects two mandatory parameters `email` and `password` and an optional `name`. The `format` property checks that the `email` string is an email (presence of `@` character, etc). 

The `main` function is called after successful validation. It is divided into several parts. First, it creates a new user with the arguments specified in the command line. Then it establishes a connection to the database and saves the user.

> The `hashPassword` function is used to hash and salt passwords before storing them in the database. For security reasons, you should use this function before saving passwords.

Build the script.

```bash
npm run build
```

Then create two new users.

```bash
npx foal run create-user email="john@foalts.org" password="john_password" name="John"
npx foal run create-user email="mary@foalts.org" password="mary_password" name="Mary"
```

> If you try to re-run one of these commands, you'll get the MySQL error below as the email key is unique.
>
> `ER_DUP_ENTRY: Duplicate entry 'john@foalts.org' for key 'IDX_xxx'`

## The `create-story` script

The `create-story` script is a bit more complex as `Story` has a many-to-one relation with `User`.

```bash
npx foal generate script create-story
```

Open the `create-story.ts` file and replace its content.

```typescript
import { Logger, ServiceManager } from '@foal/core';
import { Story, User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    author: { type: 'string', format: 'email', maxLength: 255 },
    title: { type: 'string', maxLength: 255 },
    link: { type: 'string', maxLength: 255 },
  },
  required: [ 'author', 'title', 'link' ],
  type: 'object',
};

export async function main(args: { author: string, title: string, link: string }, services: ServiceManager, logger: Logger) {
  await dataSource.initialize();

  const user = await User.findOneByOrFail({ email: args.author });

  const story = new Story();
  story.author = user;
  story.title = args.title;
  story.link = args.link;

  try {
    await story.save();

    logger.info(`Story created: ${story.id}`);
  } finally {
    await dataSource.destroy();
  }
}

```

We added an `author` parameter to know which user posted the story. It expects the user's email.

The `main` function then tries to find the user who has this email. If it exists, the user is added to the story as the author. If it does not, then the script ends with a message displayed in the console.

Build the script.

```bash
npm run build
```

And create new stories for each user.

```bash
npx foal run create-story author="john@foalts.org" title="How to build a simple to-do list" link="https://foalts.org/docs/tutorials/simple-todo-list/1-installation"
npx foal run create-story author="mary@foalts.org" title="FoalTS architecture overview" link="https://foalts.org/docs/architecture/architecture-overview"
npx foal run create-story author="mary@foalts.org" title="Authentication with Foal" link="https://foalts.org/docs/authentication/quick-start"
```
