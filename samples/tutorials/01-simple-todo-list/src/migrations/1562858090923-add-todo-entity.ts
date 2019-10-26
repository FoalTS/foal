import {MigrationInterface, QueryRunner} from 'typeorm';

export class AddTodoEntity1562858090923 implements MigrationInterface {
    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('CREATE TABLE "todo" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "text" varchar NOT NULL)');
        await queryRunner.query('CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL)');
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE "user"');
        await queryRunner.query('DROP TABLE "todo"');
    }
}
