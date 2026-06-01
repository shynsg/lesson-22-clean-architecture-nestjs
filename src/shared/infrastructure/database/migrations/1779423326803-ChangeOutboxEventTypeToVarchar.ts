import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeOutboxEventTypeToVarchar1779423326803 implements MigrationInterface {
    name = 'ChangeOutboxEventTypeToVarchar1779423326803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "outbox_events"
            ALTER COLUMN "event_type" TYPE character varying
            USING "event_type"::text
        `);
        await queryRunner.query(`DROP TYPE "public"."outbox_events_event_type_enum"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."outbox_events_event_type_enum" AS ENUM('order.created')`);
        await queryRunner.query(`
            ALTER TABLE "outbox_events"
            ALTER COLUMN "event_type" TYPE "public"."outbox_events_event_type_enum"
            USING "event_type"::"public"."outbox_events_event_type_enum"
        `);
    }

}
