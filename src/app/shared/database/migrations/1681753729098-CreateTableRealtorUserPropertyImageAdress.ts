import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableRealtorUserPropertyImageAdress1681753729098 implements MigrationInterface {
    name = 'CreateTableRealtorUserPropertyImageAdress1681753729098'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "imoveis"."user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "message" character varying(1000) NOT NULL, "status" boolean NOT NULL DEFAULT false, "id_realtorr" uuid NOT NULL, "athr_created" TIMESTAMP NOT NULL DEFAULT now(), "athr_update" TIMESTAMP NOT NULL DEFAULT now(), "id_realtor" uuid, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "imoveis"."realtor" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "athr_created" TIMESTAMP NOT NULL DEFAULT now(), "athr_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0b53262aa04ea0f7d2f22d6ff93" UNIQUE ("email"), CONSTRAINT "PK_b7a05ae929387eaab39a2ea0c2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "imoveis"."image" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "photo" character varying, "id_property" uuid NOT NULL, "athr_created" TIMESTAMP NOT NULL DEFAULT now(), "athr_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d6db1ab4ee9ad9dbe86c64e4cc3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "imoveis"."property" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "type" character varying(1) NOT NULL, "price" integer NOT NULL, "available" character varying NOT NULL, "id_adress" uuid NOT NULL, "id_realtor" uuid NOT NULL, "athr_created" TIMESTAMP NOT NULL DEFAULT now(), "athr_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d80743e6191258a5003d5843b4f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "imoveis"."adress" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "city" character varying, "neighborhood" character varying, "street" character varying, "number" integer, "complement" character varying, "athr_created" TIMESTAMP NOT NULL DEFAULT now(), "athr_update" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f108093ea9cd9f59d72c2f1a057" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "imoveis"."user" ADD CONSTRAINT "FK_785b4ffc159aff3caee17325ae8" FOREIGN KEY ("id_realtor") REFERENCES "imoveis"."realtor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imoveis"."image" ADD CONSTRAINT "FK_7c930a477a7d82aa2ea91d6ae96" FOREIGN KEY ("id_property") REFERENCES "imoveis"."property"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imoveis"."property" ADD CONSTRAINT "FK_c0485151c352b677f96d513d567" FOREIGN KEY ("id_adress") REFERENCES "imoveis"."adress"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "imoveis"."property" ADD CONSTRAINT "FK_cfe3c7afc68760a91a023d470aa" FOREIGN KEY ("id_realtor") REFERENCES "imoveis"."realtor"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "imoveis"."property" DROP CONSTRAINT "FK_cfe3c7afc68760a91a023d470aa"`);
        await queryRunner.query(`ALTER TABLE "imoveis"."property" DROP CONSTRAINT "FK_c0485151c352b677f96d513d567"`);
        await queryRunner.query(`ALTER TABLE "imoveis"."image" DROP CONSTRAINT "FK_7c930a477a7d82aa2ea91d6ae96"`);
        await queryRunner.query(`ALTER TABLE "imoveis"."user" DROP CONSTRAINT "FK_785b4ffc159aff3caee17325ae8"`);
        await queryRunner.query(`DROP TABLE "imoveis"."adress"`);
        await queryRunner.query(`DROP TABLE "imoveis"."property"`);
        await queryRunner.query(`DROP TABLE "imoveis"."image"`);
        await queryRunner.query(`DROP TABLE "imoveis"."realtor"`);
        await queryRunner.query(`DROP TABLE "imoveis"."user"`);
    }

}
