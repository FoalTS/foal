import {MigrationInterface, QueryRunner} from "typeorm";

export class addProfile1585904937181 implements MigrationInterface {
    name = 'addProfile1585904937181'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "temporary_user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "profile" varchar, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`, undefined);
        await queryRunner.query(`INSERT INTO "temporary_user"("id", "email", "password") SELECT "id", "email", "password" FROM "user"`, undefined);
        await queryRunner.query(`DROP TABLE "user"`, undefined);
        await queryRunner.query(`ALTER TABLE "temporary_user" RENAME TO "user"`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "user" RENAME TO "temporary_user"`, undefined);
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`, undefined);
        await queryRunner.query(`INSERT INTO "user"("id", "email", "password") SELECT "id", "email", "password" FROM "temporary_user"`, undefined);
        await queryRunner.query(`DROP TABLE "temporary_user"`, undefined);
    }

}
