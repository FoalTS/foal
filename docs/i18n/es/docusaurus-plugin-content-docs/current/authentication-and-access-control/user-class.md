---
title: Clase User & script create-user
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
import { getManager, getRepository } from 'typeorm';

import { User } from './src/app/entities';

async function main() {
  const user = new User();
  user.foo = 1;
  await user.save(); 1
  });
}
```

### ... with a Shell Script (CLI)

You can use the `create-user` shell script (located in `src/scripts`) to create a new user through the command line.

```sh
npm run build
foal run create-user
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

Go to `src/scripts/create-user.ts` and uncomment the lines mentionning the emails and passwords.

> To get it work, you will also need to install the `password` package: `npm install --save @foal/password`. The `isCommon` util helps you to detect if a password is too common (ex: 12345) and thus prevents the script from creating a new user with an unsecured password.

You can now create a new user with these commands:

```sh
npm run build
foal run create-user email=mary@foalts.org password=mary_password
```

## Using another ORM/ODM

In this document, we used TypeORM to define the `User` class and the `create-user` shell script. However, you can still use another ORM/ODM if you want to.
