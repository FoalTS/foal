---
title: Users
---


## The User Entity

```typescript
import { BaseEntity, Entity, PrimaryGenerateColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number

}
```

The `User` entity is the core of the authentication and authorization system. It is a class that represents the `user` table in the database and each of its instances represents a row in this table.

The class definition is usually located in the file `src/app/entities/user.entity.ts`. Its attributes represent the columns of the table. 

In FoalTS you can customize the `User` class to suit your needs. The framework makes no assumptions about the attributes required by the user objects. Maybe you'll need a `firstName` column, maybe not. Maybe the authentication will be processed with an email and a password or maybe you will use an authentication token. The choice is yours!

However, FoalTS provides abstract classes from which you can extend the `User` entity. Such classes, such as `UserWithPermissions`, have useful utilities for handling authentication and authorization, so that you do not have to reinvent the wheel.

## Creating Users ...

There are several ways to create users.

### ... Programmatically

```typescript
import { User } from './src/app/entities';

async function main() {
  const user = new User();
  user.foo = 1;
  await user.save();
}
```

### ... with a Shell Script (CLI)

You can use the `create-user` shell script (located in `src/scripts`) to create a new user through the command line.

```sh
npm run build
npx foal run create-user
```

## Example (email and password)

This section describes how to create users with an email and a password.

### The User Entity

Go to `src/app/entities/user.entity.ts` and add two new columns: an email and a password.

```typescript
import { hashPassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn, BeforeInsert, BeforeUpdate } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    // Hash the password before storing it in the database
    this.password = await hashPassword(this.password);
  }

}

```

> Note: The `BeforeInsert` and `BeforeUpdate` are TypeORM decorators for Entity Listeners that run before the entity is saved in the db. In this example they take care of hashing the password. More info about `Entity Listeners` in the [TypeORM docs](https://typeorm.io/#/listeners-and-subscribers)

### The create-user Shell Script

Running the `create-user` script will result in an error since we do not provide an email and a password as arguments.

Go to `src/scripts/create-user.ts` and replace its content with the following lines:

```typescript
// 3p
import { hashPassword, Logger, ServiceManager } from '@foal/core';

// App
import { User } from '../app/entities';
import { dataSource } from '../db';

export const schema = {
  additionalProperties: false,
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string' },
  },
  required: [ 'email', 'password' ],
  type: 'object',
};

export async function main(args: any, services: ServiceManager, logger: Logger) {
  await dataSource.initialize();

  try {
    const user = new User();
    user.email = args.email;
    user.password = await hashPassword(args.password);

    await user.save();

    logger.info(`User created: ${user.id}`)
  } finally {
    await dataSource.destroy();
  }
}

```

You can now create a new user with these commands:

```sh
npm run build
npx foal run create-user email=mary@foalts.org password=mary_password
```

## Using another ORM/ODM

In this document, we used TypeORM to define the `User` class and the `create-user` shell script. However, you can still use another ORM/ODM if you want to.
