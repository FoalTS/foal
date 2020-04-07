import {MigrationInterface, QueryRunner} from "typeorm";

export class userAndTodo1586271674386 implements MigrationInterface {
    name = 'userAndTodo1586271674386'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_ed766a9782779b8390a2a81f444" UNIQUE ("email"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_user"("id") SELECT "id" FROM "user"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "ownerId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_todo"("id", "text") SELECT "id", "text" FROM "todo"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_todo" RENAME TO "todo"`, undefined);
        await queryRunner.query(`CREATE TABLE "temporary_todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "ownerId" integer, CONSTRAINT "FK_05552e862619dc4ad7ec8fc9cb8" FOREIGN KEY ("ownerId") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_todo"("id", "text", "ownerId") SELECT "id", "text", "ownerId" FROM "todo"`, undefined);
        await queryRunner.query(`DROP TABLE "todo"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_todo" RENAME TO "todo"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "todo" RENAME TO "temporary_todo"`, undefined);
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL, "ownerId" integer)`, undefined);
        await queryRunner.query(`INSERT INTO "todo"("id", "text", "ownerId") SELECT "id", "text", "ownerId" FROM "temporary_todo"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_todo"`, undefined);
        await queryRunner.query(`ALTER TABLE "todo" RENAME TO "temporary_todo"`, undefined);
        await queryRunner.query(`CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "todo"("id", "text") SELECT "id", "text" FROM "temporary_todo"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_todo"`, undefined);
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)`, undefined);
        await queryRunner.query(`INSERT INTO "user"("id") SELECT "id" FROM "temporary_user"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_user"`, undefined);
    }

}
