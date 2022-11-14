---
title: Utiliser un autre ORM
sidebar_label: Introduction
---

The core of the framework is independent of TypeORM. So, if you do not want to use an ORM at all or use another ORM or ODM than TypeORM, you absolutely can.

To do so, you will have to remove TypeORM and all its utilities.

## Uninstall TypeORM

1. First uninstall the dependencies.

    ```bash
    npm uninstall typeorm @foal/typeorm
    ```

2. Then remove the directory `src/app/entities` and the file `src/db.ts`.

3. Remove or replace the script `create-user` in `src/app/scripts`.

4. In the file `src/index.ts`, delete the connection creation called `dataSource.initialize()`.

5. Finally, remove in `package.json` the scripts to manage migrations.

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

Update your `src/app/db.ts` to create the prisma connection:

```typescript
import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();
```

Then update your `src/index.ts` to inject it into the service manager.

*src/index.ts*
```typescript
// 3p
import { ServiceManager } from '@foal/core';
import { PrismaClient } from '@prisma/client';

// App
import { AppController } from './app/app.controller';
import { prisma } from './db';

async function main() {
  const serviceManager = new ServiceManager()
    .set(PrismaClient, prisma);
  const app = await createApp(AppController, { serviceManager });

  // ...
}

main()
  .catch(err => { console.error(err.stack); process.exit(1); })
  .finally(() => { prisma.$disconnect().catch(err => console.error(err)) });
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

#### Authenticating users

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

Then add the `user` option to your authentication hooks as follows:

```typescript
@JWTRequired({
  user: (id: number, services: ServiceManager) => services.get(PrismaClient).user.findFirst({
    where: { id }
  })
})
// OR
@UseSessions({
  user: (id: number, services: ServiceManager) => services.get(PrismaClient).user.findFirst({
    where: { id }
  })
})
```

## Limitations

When using another ORM than TypeORM some features, are not available:
- the *Groups & Permissions* system,
- and the `foal g rest-api` command.