import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { OrdersModule } from "./modules/orders/orders.module";
import { OutboxModule } from "./modules/outbox/outbox.module";
import { PostsModule } from "./modules/posts/posts.module";
import { CommentModule } from "./modules/comments/comments.module";
import { DatabaseModule } from "./shared/infrastructure/database/database.module";
import { APP_FILTER } from "@nestjs/core";
import { AppErrorFilter } from "./shared/interfaces/http/domain-error.filter";
import { CheckoutModule } from "./modules/checkout/checkout.module";

@Module({
  imports: [
    // Load .env vào process.env, available toàn app
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // PostgreSQL connection — comment dòng này nếu không dùng DB
    DatabaseModule,
    CheckoutModule,
    OutboxModule,
    PostsModule,
    OrdersModule,
    CommentModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: AppErrorFilter,
    },
  ],
})
export class AppModule {}
