# The User & Todo Models

First delete the `db.sqlite3` database from the root directory. You will define new models in this tutorial that would conflict with the old definition of its tables.

## The User Model

Then open the `user.entity.ts` file from the `src/app/entities` directory. The `User` entity is the main class used by the framework's authentication system. It extends the `UserWithPermissions` class which contains methods and properties useful for handling complex access controls.

Add the `email` and `password` properties and the `setPassword` method.

```typescript
import { encryptPassword } from '@foal/core';
import { UserWithPermissions } from '@foal/typeorm';
import { Column, Entity } from 'typeorm';

@Entity()
export class User extends UserWithPermissions {

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await encryptPassword(password, { legacy: true });
  }

}

export { Group, Permission } from '@foal/typeorm';
```

The `setPassword` method uses `encryptPassword` to encrypt passwords before storing them in the database. You must use this method to set a password instead of directly assigning a value to the `password` attribute.

## The Todo Model

The Todo model defined in the previous tutorial now needs a `owner` property to know which user it belongs to.

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

  @ManyToOne(type => User, { nullable: false })
  owner: User;

}

```

In the database the `todo` table will look like this:

```
+------------+-----------+-------------------------------------+
|                             todo                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| text       | varchar   | NOT NULL                            |
| ownerId    | integer   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```
