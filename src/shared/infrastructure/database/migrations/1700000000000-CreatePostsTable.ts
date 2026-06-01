import { MigrationInterface, QueryRunner } from "typeorm";

export class CreatePostsTable1700000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "posts" (
        "id"          UUID          NOT NULL,
        "title"       VARCHAR(120)  NOT NULL,
        "description" TEXT          NOT NULL DEFAULT '',
        "created_at"  TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "updated_at"  TIMESTAMPTZ   NOT NULL DEFAULT now(),
        "deleted_at"  TIMESTAMPTZ   NULL,
        CONSTRAINT "PK_posts" PRIMARY KEY ("id")
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_posts_deleted_at" ON "posts" ("deleted_at")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX "IDX_posts_deleted_at"`);
    await queryRunner.query(`DROP TABLE "posts"`);
  }
}
