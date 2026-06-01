import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateCommentsTable1779337993685 implements MigrationInterface {
    name = 'CreateCommentsTable1779337993685'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_posts_deleted_at"`);
        await queryRunner.query(`CREATE TABLE "comments" ("id" uuid NOT NULL, "post_id" uuid NOT NULL, "content" text NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_8bf68bc960f2b69e818bdb90dcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "description" DROP DEFAULT`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "description" SET DEFAULT ''`);
        await queryRunner.query(`DROP TABLE "comments"`);
        await queryRunner.query(`CREATE INDEX "IDX_posts_deleted_at" ON "posts" ("deleted_at") `);
    }

}
