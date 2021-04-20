---
title: Using Another ORM or Query Builder
sidebar_label: Using Another ORM
---

The core of the framework is independent of TypeORM. So, if you do not want to use an ORM at all or use another ORM or ODM than TypeORM, you absolutely can.

To do so, you will have to remove TypeORM and all its utilities and implement some functions yourself like the authentication function `fetchUser`.

## Uninstall TypeORM

1. First uninstall the dependencies.

    ```bash
    npm uninstall typeorm @foal/typeorm
    ```

2. Then remove the directory `src/app/entities`.

3. Remove or replace the script `create-user` in `src/app/scripts`.

4. In the file `app.controller.ts`, delete the connection creation call `createConnection`.

5. Finally, remove in `package.json` the scripts to manage migrations.

## Functions to Be Added

### The `fetchUser` function

If you wish to use the `user` option of `@JWTRequired` or `@UseSessions` to set the `ctx.user` property, then you will need to implement your own `fetchUser` function.

This utility returns a function that takes an `id` as parameter which might be a `string` or a `number` and returns a promise. The promise value must be `undefined` is no user matches the given `id` and the *user object* otherwise.

*Example*
```typescript
import { FetchUser, ServiceManager } from '@foal/core';

export function fetchUser(userModel: any): FetchUser {
  return async (id: number|string, services: ServiceManager) => {
    if (typeof id === 'string') {
      throw new Error('The user ID must be a number.');
    }
    const user = await userModel.findOne({ id });
    if (user === null) {
      return undefined;
    }
    return user;
  };
}
```

## Examples

### Prisma

> *This example uses an SQLite database.*

#### Warning on Configuration

Prisma uses the [dotenv library](https://www.npmjs.com/package/dotenv) under the hood which handles `.env` files and environment variables differently.

Therefore, when using Prisma, you can only use one single `.env` file. Using other files such as `.env.local` or `.env.production` will lead to unexpected variable values.

#### Basic Set Up

Install the latest version of TypeScript (Prisma v2.21 requires at least v4.1).

```bash
npm install typescript@latest
```

> *If you get compile-time errors referencing the file `node_modules/.prisma/client/index.d.ts`, it is likely that your version of TypeScript is too old.*

Install the Prisma dependencies.

```bash
npm install prisma --save-dev
npm install @prisma/client
```

Init the project.

```bash
npx prisma init
```

Set up the database configuration in `prisma/schema.prisma`.

```
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

Specify the database URL in the `.env` file.

```bash
DATABASE_URL="file:./db.sqlite3"
```

Generate and run the migration.
```bash
npx prisma migrate dev --name init
```

Generate the TypeScript interfaces.
```bash
npx prisma generate
```

Update your `src/index.ts` to create the prisma connection and pass it to the service manager.

*src/index.ts*
```typescript
// 3p
import { ServiceManager } from '@foal/core';
import { PrismaClient } from '@prisma/client';

// App
import { AppController } from './app/app.controller';

const prisma = new PrismaClient();

async function main() {
  const serviceManager = new ServiceManager();
  serviceManager.set(PrismaClient, prisma);
  const app = await createApp(AppController, { serviceManager });

  // ...
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); })
  .finally(() => prisma.$disconnect());
```

Finally, inject the prisma client into your controllers and start using it.

*app.controller.ts*
```typescript
import { dependency, Get, HttpResponseOK, IAppController } from '@foal/core';
import { PrismaClient } from '@prisma/client';

export class AppController implements IAppController {
  @dependency
  prisma: PrismaClient;

  @Get('/users')
  async getAllUsers() {
    const allUsers = await this.prisma.user.findMany();
    return new HttpResponseOK(allUsers);
  }
}
```

#### The `fetchUser` function

In case your application uses the hooks `@UseSessions` or `@JWTRequired` and you want to assign a value to `ctx.user`, then you will need to create a `fetchUser` function.

First, make sure your have a `User` model defined in `schema.prisma`.

```prisma
// ...

model User {
  id    Int     @id @default(autoincrement())
  email String  @unique
  name  String?
}
```

If you haven't already done so, generate and run the migration and generate the TypeScript interfaces.

```bash
npx prisma migrate dev --name add-user
npx prisma generate
```

Then create the `fetchPrismaUser` function.
```typescript
import { ServiceManager } from '@foal/core';
import { PrismaClient } from '@prisma/client';

export async function fetchPrismaUser(id: number|string, services: ServiceManager) {
  if (typeof id === 'string') {
    throw new Error('The user ID must be a number.');
  }

  const user = await services.get(PrismaClient).user.findFirst({
    where: { id }
  });

  if (user === null) {
    return undefined;
  }
  
  return user;
}
```

You're now ready to use it in your hooks.
```typescript
@JWTRequired({ user: fetchPrismaUser })
// OR
@UseSessions({ user: fetchPrismaUser })
```

## Limitations

When using another ORM than TypeORM some features, are not available:
- the *Groups & Permissions* system,
- and the `foal g rest-api` command.