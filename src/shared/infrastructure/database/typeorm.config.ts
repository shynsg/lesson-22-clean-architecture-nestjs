import "reflect-metadata";
import { DataSource } from "typeorm";
import * as dotenv from "dotenv";

dotenv.config();

// Config cho TypeORM CLI — dùng khi chạy migration:run, migration:generate
export default new DataSource({
  type: "postgres",
  host: process.env["DB_HOST"] ?? "localhost",
  port: parseInt(process.env["DB_PORT"] ?? "5432", 10),
  username: process.env["DB_USERNAME"] ?? "postgres",
  password: process.env["DB_PASSWORD"] ?? "postgres",
  database: process.env["DB_DATABASE"] ?? "clean_arch_dev",
  entities: ["src/**/*.orm-entity.ts"],
  migrations: ["src/shared/infrastructure/database/migrations/*.ts"],
  synchronize: false,
  logging: true,
});
