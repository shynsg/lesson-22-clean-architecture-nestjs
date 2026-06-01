import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOrderTable1779349163767 implements MigrationInterface {
    name = 'CreateOrderTable1779349163767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_status_enum" AS ENUM('CREATED', 'PAID')`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" uuid NOT NULL, "customer_id" character varying NOT NULL, "status" "public"."orders_status_enum" NOT NULL, "total_amount" integer NOT NULL, "items" jsonb NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TYPE "public"."orders_status_enum"`);
    }

}
