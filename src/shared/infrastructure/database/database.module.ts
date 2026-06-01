import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: "postgres" as const,
        host: config.get<string>("DB_HOST") ?? "localhost",
        port: config.get<number>("DB_PORT") ?? 5432,
        username: config.get<string>("DB_USERNAME") ?? "postgres",
        password: config.get<string>("DB_PASSWORD") ?? "postgres",
        database: config.get<string>("DB_DATABASE") ?? "clean_arch_dev",
        autoLoadEntities: true,
        migrations: [__dirname + "/migrations/*{.ts,.js}"],
        synchronize: false,
        logging: ["error"],
      }),
    }),
  ],
})
export class DatabaseModule {}
