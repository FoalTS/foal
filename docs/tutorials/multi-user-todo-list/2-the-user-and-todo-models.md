# The User & Todo Models

> You are reading the documentation for version 2 of FoalTS. The documentation for version 1 can be found [here](#). To migrate to version 2, follow [this guide](../upgrade-to-v2/index.md).

First of all, if you have downloaded the source code of the previous tutorial, compile and run the existing migrations.

```
npm run build
npm run migrations
```

## The User Model

Then open the `user.entity.ts` file from the `src/app/entities` directory. The `User` entity is the main class used by the framework's authentication system.

Add the `email` and `password` properties and the `setPassword` method.

```typescript
import { hashPassword } from '@foal/core';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  async setPassword(password: string) {
    this.password = await hashPassword(password);
  }

}

```

The `setPassword` method uses `hashPassword` to hash passwords before storing them in the database. You must use this method to set a password instead of directly assigning a value to the `password` attribute.

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

  @ManyToOne(type => User)
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
| ownerId    | integer   |                                     |
+------------+-----------+-------------------------------------+
```

## The Migrations

The last step is to create/update the tables in the database. As in the first tutorial, you will use migrations for this.

Generate the migrations from the entities.

```
npm run makemigrations
```

A new file is added in `src/migrations`.

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1562765487944 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        // SQL queries...
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // SQL queries...
    }

}
```

Then run the new migration file.

```
npm run migrations
```
