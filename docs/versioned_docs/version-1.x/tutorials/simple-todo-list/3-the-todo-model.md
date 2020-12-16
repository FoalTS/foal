---
title: The Todo Model
---

Let&#8217;s create your first model. The CLI provides a useful command to generate a new file with an empty model.

```sh
foal generate entity todo
```

> FoalTS uses [TypeORM](http://typeorm.io), a complete *Object-Relational Mapper*, to communicate with the database(s). In TypeORM, simple models are called *entities* and are classes decorated with the `Entity` decorator.


> Every new project in FoalTS uses an `SQLite` database as it does not require any additional installation. But TypeORM supports many other databases. We will keep this one in this tutorial for simplicity.

Open the file `todo.entity.ts` in the `src/app/entities` directory and add a `text` column.

```typescript
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Todo {

  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

}

```

This class is the representation of the SQL table `todo`. Currently, this table does not exist in the database. You will have to create it.

You can do this manually, using a database software for example, or use migrations, a programmatic way to update a database schema. The advantage of using migrations is that you can create, update and delete your tables directly from the definition of your entities. They also ensure that all your environments (prod, dev) and co-developers have the same table definitions.

Let&#8217;s see how to use them.

First compile the application.

```
npm run build:app
```

Then run the following command to generate your migration file. TypeORM will compare your current database schema with the definition of your entities and generate the appropriate SQL queries.

```
npm run migration:generate -- --name=add-todo-entity
```

A new file appears in the `src/migrations/` directory. Open it.

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class addTodoEntity1562755564200 implements MigrationInterface {
    name = 'addTodoEntity1562755564200'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL)`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
    }

}

```

The `up` method contains all the SQL queries that will be executed during the migration.

Let's compile and run the migration.

```
npm run build:migrations
npm run migration:run
```

TypeORM examines all the migrations that have been run previously (none in this case) and executes the new ones.

Your database (`db.sqlite3`) now contains a new table named `todo`:


```
+------------+-----------+-------------------------------------+
|                             todo                             |
+------------+-----------+-------------------------------------+
| id         | integer   | PRIMARY KEY AUTO_INCREMENT NOT NULL |
| text       | varchar   | NOT NULL                            |
+------------+-----------+-------------------------------------+
```

> Alternatively, you can also use the `synchronize` option in your configuration file `config/default.json`. When set to `true`, the database schema is auto created from the entities definition on every application launch. You do not need migrations in this case. However, although this behavior may be useful during debug and development, it is not suitable for a production environment (you could lose production data).
