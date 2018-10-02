# The User & Todo Models

First delete the `db.sqlite3` database from the root directory. You will define new models in this tutorial that would conflict with the old definition of its tables.

## The User Model

Then open the `user.entity.ts` file from the `src/app/entities` directory. The `User` entity is the main class used by the framework's authentication system. It extends the `AbstractUser` class which contains methods and properties useful for handling complex access controls.

Add the `email` and `password` properties and the `setPassword` method.

```typescript
import { AbstractUser, parsePassword } from '@foal/core';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends AbstractUser {

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await parsePassword(password);
  }

}

export { Group, Permission } from '@foal/core';
```

The `parsePassword` util takes care of the password encryption to not store it as plain text in the database. When setting a password the `setPassword` method should be used instead of assigning directly a value to the password property.

## The Todo Model

The Todo model defined in the previous tutorial now needs an `owner` property to know which user it belongs to.

Replace the content of `todo.entity.ts`.

```typescript
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Todo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @ManyToOne(type => User)
  owner: User;

}

```