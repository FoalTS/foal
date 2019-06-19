import {MigrationInterface, QueryRunner} from "typeorm";

export class foalSession1560931215670 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_0777702b851f7662e2678b4568"`);
        await queryRunner.query(`DROP INDEX "IDX_24022d7e409de3835f25603d35"`);
        await queryRunner.query(`DROP INDEX "IDX_8abdfe8f9d78a4f5e821dbf620"`);
        await queryRunner.query(`DROP INDEX "IDX_84ff6a520aee2bf2512c01cf46"`);
        await queryRunner.query(`DROP INDEX "IDX_4a38ad03e94f4de594fc09fb53"`);
        await queryRunner.query(`DROP INDEX "IDX_4c3462965c06c5bc3c8996f452"`);
        await queryRunner.query(`CREATE TABLE "foal_session" ("sessionID" varchar PRIMARY KEY NOT NULL, "sessionContent" text NOT NULL, "createdAt" bigint NOT NULL, "updatedAt" bigint NOT NULL)`);
        await queryRunner.query(`CREATE INDEX "IDX_24022d7e409de3835f25603d35" ON "group_permissions_permission" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0777702b851f7662e2678b4568" ON "group_permissions_permission" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84ff6a520aee2bf2512c01cf46" ON "user_groups_group" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8abdfe8f9d78a4f5e821dbf620" ON "user_groups_group" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4c3462965c06c5bc3c8996f452" ON "user_user_permissions_permission" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a38ad03e94f4de594fc09fb53" ON "user_user_permissions_permission" ("permissionId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP INDEX "IDX_4a38ad03e94f4de594fc09fb53"`);
        await queryRunner.query(`DROP INDEX "IDX_4c3462965c06c5bc3c8996f452"`);
        await queryRunner.query(`DROP INDEX "IDX_8abdfe8f9d78a4f5e821dbf620"`);
        await queryRunner.query(`DROP INDEX "IDX_84ff6a520aee2bf2512c01cf46"`);
        await queryRunner.query(`DROP INDEX "IDX_0777702b851f7662e2678b4568"`);
        await queryRunner.query(`DROP INDEX "IDX_24022d7e409de3835f25603d35"`);
        await queryRunner.query(`DROP TABLE "foal_session"`);
        await queryRunner.query(`CREATE INDEX "IDX_4c3462965c06c5bc3c8996f452" ON "user_user_permissions_permission" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_4a38ad03e94f4de594fc09fb53" ON "user_user_permissions_permission" ("permissionId") `);
        await queryRunner.query(`CREATE INDEX "IDX_84ff6a520aee2bf2512c01cf46" ON "user_groups_group" ("userId") `);
        await queryRunner.query(`CREATE INDEX "IDX_8abdfe8f9d78a4f5e821dbf620" ON "user_groups_group" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_24022d7e409de3835f25603d35" ON "group_permissions_permission" ("groupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0777702b851f7662e2678b4568" ON "group_permissions_permission" ("permissionId") `);
    }

}
