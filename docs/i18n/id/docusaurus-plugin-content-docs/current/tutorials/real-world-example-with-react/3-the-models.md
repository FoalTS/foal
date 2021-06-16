---
title: The User and Story Models
id: tuto-3-the-models
slug: 3-the-models
---

Now that the database connection is established, you can create your two entities `User` and `Story`.

The `User` entity will be the model used by the framework to identify users and the `Story` entity will represent the users' posts.

## The `User` Model

Open the `user.entity.ts` file from the `entities` directory and add four new properties to your model: `email`, `password`, `name` and `avatar`.

The `avatar` column will contain the paths to the profile images.

You will also need to export an additional model `DatabaseSession` from the `@foal/typeorm` package. You don't need to worry about it now, it will be used later in the tutorial when you add authentication.

```typescript
import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

}

// This line is required. It will be used to create the SQL session table later in the tutorial.
export { DatabaseSession } from '@foal/typeorm';
```

## The `Story` Model

Then create your second entity.

```
foal generate entity story
```

Open the new file and add three new properties: `author`, `title` and `link`.

```typescript
import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Story extends BaseEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(type => User, { nullable: false })
  author: User;

  @Column()
  title: string;

  @Column()
  link: string;

}
```

> By default, TypeORM allows *many-to-one* relationships to be nullable. The option passed to the decorator specifies that this one cannot be.

## Run Migrations

Finally, create the tables in the database. Generate the migrations from the entities and run them.

```bash
npm run makemigrations
npm run migrations
```

Three new tables are added to the database: the `user` and `story` tables and a `sessions` table.

```
+------------+-----------+-------------------------------------+
|                             user                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| email      | varchar   | UNIQUE NOT NULL                     |
| password   | varchar   | NOT NULL                            |
| name       | varchar   | NOT NULL                            |
| avatar     | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```

```
+------------+-----------+-------------------------------------+
|                             story                            |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| authorId   | integer   | NOT NULL                            |
| title      | varchar   | NOT NULL                            |
| link       | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```