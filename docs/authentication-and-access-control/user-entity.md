# User Entity and `create-user` Script

## The User Entity

The `User` entity is the core of the authentication and authorization system. It is a class that represents the `user` table in the database and each of its instances represents a row in this table.

The class definition is usually located in the file `src/app/entities/user.entity.ts`. Its attributes represent the columns of the table. It extends the `UserWithPermissions` which has some useful utilities to handle authentication and authorization.

The primary attributes of the `UserWithPermissions` are:

| Property name | Type | Database Link |
| --- | --- | --- |
| id | number | Primary auto generated key |
| groups | Group[] | A many-to-many relation with the table group |
| userPermissions | Permission[] | A many-to-many relation with the table permission |

> In FoalTS you can customize the `User` class to suit your needs. The framework makes no assumptions about the attributes required by the user objects. Maybe you'll need a `firstName` column, maybe not.  Maybe the authentication will be processed with an email and a password or maybe you will use an authentication token. The choice is yours!

## Creating Users ...

There are several ways to create users.

### ... Programmatically

```typescript
import { getManager, getRepository } from 'typeorm';

import { User } from './src/app/entities';

async function main() {
  const user = new User();
  user.foo = 1;
  await getManager().save(user);
  // OR
  await getManager().save(User, {
    foo: 1
  });
  // OR
  await getRepository(User).save({
    foo: 1
  });
}
```

### ... with a Shell Script (CLI)

You can use the `create-user` shell script (located in `src/scripts`) to create a new user through the command line.

```sh
npm run build:scripts
foal run-script create-user
```

## Authenticating Users

In FoalTS authentication is handled with *authenticators*. An authenticator is a service that implements the `IAuthenticator<User>` interface. It has a method `authenticate(credentials: any): User | null | Promise<User | null>` which returns the user if the credentials are correct or null otherwise.

The choice of the *authenticator* service depends on which authentication mechanism(s) your application support (passwords, OAuth, etc).

*Example*
```typescript
import { dependency } from '@foal/core';

import { MyAuthenticator } from 'somewhere';

export class MyService {
  @dependency
  myAuthenticator: MyAuthenticator;

  async logUser(credentials) {
    const user = await this.myAuthenticator.authenticate(credentials);
    if (!user) {
      console.log('Error: The credentials are incorrect.');
      return;
    }
    console.log(user);
  }
}
```

## Using Email and Password

This section describes how to handle authentication with an email and a password.

### The User Entity

Go to `src/app/entities/user.entity.ts` and add two new columns: an email and a password.

```typescript
import { encryptPassword } from '@foal/core';
import { UserWithPermissions } from '@foal/typeorm';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
​
@Entity()
export class User extends UserWithPermissions {
​
  @PrimaryGeneratedColumn()
  id: number;
​
  @Column({ unique: true })
  email: string;
​
  @Column()
  password: string;
​
  async setPassword(password: string) {
    // Encrypt the password before storing it in the database
    this.password = await encryptPassword(password, { legacy: true });
  }​
}

export { Group, Permission } from '@foal/typeorm';

```

> Note: When creating a new user programmatically you should use the `setPassword` method instead of assigning directly the `password` property. Otherwise the password will be stored in clear text  in the database and the `EmailAuthenticator` won't be able to decode it.

### The create-user Shell Script

Running the `create-user` script will result in an error since we do not provide an email and a password as arguments.

Go to `src/scripts/create-user.ts` and uncomment the lines mentionning the emails and passwords.

> To get it work, you will also need to install the `password` package: `npm install --save @foal/password`. The `isCommon` util helps you to detect if a password is too common (ex: 12345) and thus prevents the script from creating a new user with an unsecured password.

You can now create a new user with these commands:

```sh
npm run build:scripts
foal run-script create-user email=mary@foalts.org password=mary_password
```

### The EmailAuthenticator

The `EmailAuthenticator` is designed to authenticate users having an email and a password.

```sh
foal g service authenticator
> EmailAuthenticator
```

```typescript
import { EmailAuthenticator } from '@foal/typeorm';

import { User } from '../entities';

export class Authenticator extends EmailAuthenticator<User> {
  entityClass = User;
}

```

You can now call the method `authenticate({ email, password }): Promise<User|null>` of the `Authenticator` service to authenticate a user.

*Example*

```typescript
import { Context, dependency, HttpResponseOK, Post } from '@foal/core';
import { emailSchema } from '@foal/typeorm';

import { Authenticator } from '../services';

export class AppController {
  @dependency
  authenticator: Authenticator;

  @Post('/log_user')
  @ValidateBody(emailSchema)
  async logUser(ctx: Context) {
    const user = await this.authenticator.authenticate(ctx.request.body);
    console.log(user);
    return new HttpResponseOK();
  }

}
```