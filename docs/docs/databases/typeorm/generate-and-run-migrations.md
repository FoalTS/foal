---
title: Generate & Run Migrations
sidebar_label: Migrations
---


Database migrations are a way of propagating changes you make to your entities into your database schema. The changes you make to your models (adding a field, deleting an entity, etc.) do not automatically modify your database. You have to do it yourself.

You have two options: update the database schema manually (using database software, for example) or run migrations.

Migrations are a programmatic technique for updating or reverting a database schema in a predictable and repeatable way. They are defined with classes, each of which has an `up` method and a `down` method. The first one contains SQL queries to update the database schema to reflect the new models. The second contains SQL queries to revert the changes made by the `up` method.

Theses classes are located in separate files in the `src/migrations` directory.

*Example of a migration file*
```typescript
import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostRefactoringTIMESTAMP implements MigrationInterface {
    
    async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "title" TO "name"`);
    }

    async down(queryRunner: QueryRunner): Promise<any> { 
        await queryRunner.query(`ALTER TABLE "post" RENAME COLUMN "name" TO "title"`); // reverts things made in "up" method
    }
}
```

## The Commands

### Generating Migrations Automatically

Usually, you do not need to write migrations manually. TypeORM offers a powerful feature to generate your migration files based on the changes you make to your entities.

```sh
npm run makemigrations
```

### Run the migrations

```sh
npm run migrations
```

### Revert the last migration

```sh
npm run revertmigration
```

### A Complete Example

&nbsp;1. Create a new `User` entity.

```typescript
import { Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {

  @PrimaryGeneratedColumn()
  id: number;

}
```

&nbsp;2. Make the migration file.

```
npm run makemigrations
```

A new file `xxx-migration.ts` appears in `src/directory`.

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1561976236112 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "user"`);
    }

}

```

&nbsp;3. Run the migration.

```
npm run migrations
```

&nbsp;4. Add new columns to the entity.

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

&nbsp;5. Generate another migration file.

```
npm run makemigrations
```

Another file `xxx-migration.ts` appears in `src/directory`.

```typescript
import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1561981516514 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_user"("id") SELECT "id" FROM "user"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`);
        await queryRunner.query(`INSERT INTO "user"("id") SELECT "id" FROM "temporary_user"`);
        await queryRunner.query(`DROP TABLE "temporary_user"`);
    }

}

```

&nbsp;6. Run the migration.

```
npm run migrations
```

## The `synchronize` and `dropSchema` options

These two options are particularly useful for testing.

- `synchronize` - Indicates if database schema should be auto created on every application launch.
- `dropSchema` - Drops the schema each time connection is being established.

Using the `synchronize` option for production is not recommended as you could loose data by mistake.

## Advanced

The [TypeORM documentation](http://typeorm.io/#/migrations) gives more details on how to write migrations.
