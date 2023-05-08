import { MigrationInterface, QueryRunner } from "typeorm";

export class TesteMigrations1683247210610 implements MigrationInterface {
    name = 'TesteMigrations1683247210610'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "message" varchar NOT NULL, "descript" varchar NOT NULL, "status" boolean NOT NULL DEFAULT (0), "id_usuario" varchar NOT NULL, "at_created" datetime NOT NULL DEFAULT (datetime('now')), "at_update" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" varchar PRIMARY KEY NOT NULL, "name" varchar(30), "email" varchar NOT NULL, "password" varchar NOT NULL, "status" boolean NOT NULL DEFAULT (0), "at_created" datetime NOT NULL DEFAULT (datetime('now')), "at_update" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"))`);
        await queryRunner.query(`CREATE TABLE "temporary_message" ("id" varchar PRIMARY KEY NOT NULL, "message" varchar NOT NULL, "descript" varchar NOT NULL, "status" boolean NOT NULL DEFAULT (0), "id_usuario" varchar NOT NULL, "at_created" datetime NOT NULL DEFAULT (datetime('now')), "at_update" datetime NOT NULL DEFAULT (datetime('now')), CONSTRAINT "FK_55803df68e9d91464a84c9598dd" FOREIGN KEY ("id_usuario") REFERENCES "user" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`);
        await queryRunner.query(`INSERT INTO "temporary_message"("id", "message", "descript", "status", "id_usuario", "at_created", "at_update") SELECT "id", "message", "descript", "status", "id_usuario", "at_created", "at_update" FROM "message"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`ALTER TABLE "temporary_message" RENAME TO "message"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" RENAME TO "temporary_message"`);
        await queryRunner.query(`CREATE TABLE "message" ("id" varchar PRIMARY KEY NOT NULL, "message" varchar NOT NULL, "descript" varchar NOT NULL, "status" boolean NOT NULL DEFAULT (0), "id_usuario" varchar NOT NULL, "at_created" datetime NOT NULL DEFAULT (datetime('now')), "at_update" datetime NOT NULL DEFAULT (datetime('now')))`);
        await queryRunner.query(`INSERT INTO "message"("id", "message", "descript", "status", "id_usuario", "at_created", "at_update") SELECT "id", "message", "descript", "status", "id_usuario", "at_created", "at_update" FROM "temporary_message"`);
        await queryRunner.query(`DROP TABLE "temporary_message"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "message"`);
    }

}
