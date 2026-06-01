import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNewOrder1779446017936 implements MigrationInterface {
    name = 'UpdateNewOrder1779446017936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ADD "subtotal_amount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "discount_amount" integer NOT NULL DEFAULT 0`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "is_vip_customer" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "description" SET DEFAULT ''`);
        await queryRunner.query(`CREATE INDEX "IDX_comments_post_id" ON "comments" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_posts_deleted_at" ON "posts" ("deleted_at") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_posts_deleted_at"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_comments_post_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "description" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "is_vip_customer"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "discount_amount"`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "subtotal_amount"`);
    }

}
