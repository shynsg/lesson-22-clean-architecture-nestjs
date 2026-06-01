import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdateNewOrder1779446097572 implements MigrationInterface {
    name = 'UpdateNewOrder1779446097572'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total_amount" SET DEFAULT '0'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "total_amount" DROP DEFAULT`);
    }

}
