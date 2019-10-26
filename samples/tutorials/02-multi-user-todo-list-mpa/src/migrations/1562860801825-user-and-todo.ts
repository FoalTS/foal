import {MigrationInterface, QueryRunner} from 'typeorm';

export class UserAndTodo1562860801825 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))');
        await queryRunner.query('INSERT INTO "temporary_user"("id") SELECT "id" FROM "user"');
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query('ALTER TABLE "temporary_user" RENAME TO "user"');
        await queryRunner.query('CREATE TABLE "temporary_todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "ownerId" integer NOT NULL)');
        await queryRunner.query('INSERT INTO "temporary_todo"("id", "text") SELECT "id", "text" FROM "todo"');
        await queryRunner.query('DROP TABLE "todo"');
        await queryRunner.query('ALTER TABLE "temporary_todo" RENAME TO "todo"');
        await queryRunner.query('CREATE TABLE "temporary_todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "ownerId" integer NOT NULL, CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)');
        await queryRunner.query('INSERT INTO "temporary_todo"("id", "text", "ownerId") SELECT "id", "text", "ownerId" FROM "todo"');
        await queryRunner.query('DROP TABLE "todo"');
        await queryRunner.query('ALTER TABLE "temporary_todo" RENAME TO "todo"');
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('ALTER TABLE "todo" RENAME TO "temporary_todo"');
        await queryRunner.query('CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "ownerId" integer NOT NULL)');
        await queryRunner.query('INSERT INTO "todo"("id", "text", "ownerId") SELECT "id", "text", "ownerId" FROM "temporary_todo"');
        await queryRunner.query('DROP TABLE "temporary_todo"');
        await queryRunner.query('ALTER TABLE "todo" RENAME TO "temporary_todo"');
        await queryRunner.query('CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL)');
        await queryRunner.query('INSERT INTO "todo"("id", "text") SELECT "id", "text" FROM "temporary_todo"');
        await queryRunner.query('DROP TABLE "temporary_todo"');
        await queryRunner.query('ALTER TABLE "user" RENAME TO "temporary_user"');
        await queryRunner.query('CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)');
        await queryRunner.query('INSERT INTO "user"("id") SELECT "id" FROM "temporary_user"');
        await queryRunner.query('DROP TABLE "temporary_user"');
    }
}
