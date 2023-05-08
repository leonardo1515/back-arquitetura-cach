import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTables1683247125314 implements MigrationInterface {
    name = 'CreateTables1683247125314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "notes"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(30), "email" character varying NOT NULL, "password" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, "at_created" TIMESTAMP NOT NULL DEFAULT now(), "at_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "notes"."message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying NOT NULL, "descript" character varying NOT NULL, "status" boolean NOT NULL DEFAULT false, "id_usuario" uuid NOT NULL, "at_created" TIMESTAMP NOT NULL DEFAULT now(), "at_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "notes"."message" ADD CONSTRAINT "FK_55803df68e9d91464a84c9598dd" FOREIGN KEY ("id_usuario") REFERENCES "notes"."user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notes"."message" DROP CONSTRAINT "FK_55803df68e9d91464a84c9598dd"`);
        await queryRunner.query(`DROP TABLE "notes"."message"`);
        await queryRunner.query(`DROP TABLE "notes"."user"`);
    }

}
