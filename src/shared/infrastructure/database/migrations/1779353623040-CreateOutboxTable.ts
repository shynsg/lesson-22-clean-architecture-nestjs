import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateOutboxTable1779353623040 implements MigrationInterface {
    name = 'CreateOutboxTable1779353623040'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."outbox_events_event_type_enum" AS ENUM('order.created')`);
        await queryRunner.query(`CREATE TABLE "outbox_events" ("id" uuid NOT NULL, "topic" character varying NOT NULL, "event_type" "public"."outbox_events_event_type_enum" NOT NULL, "payload" jsonb NOT NULL, "attempts" integer NOT NULL DEFAULT '0', "published_at" TIMESTAMP WITH TIME ZONE, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "locked_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_6689a16c00d09b8089f6237f1d2" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "outbox_events"`);
        await queryRunner.query(`DROP TYPE "public"."outbox_events_event_type_enum"`);
    }

}
