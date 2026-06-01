import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdempotencyModule } from "../../shared/idempotency/idempotency.module";
import { POST_REPOSITORY } from "./application/ports/post.repository";
import { CreatePostUseCase } from "./application/use-cases/create-post.use-case";
import { GetPostUseCase } from "./application/use-cases/get-post.use-case";
import { ListPostsUseCase } from "./application/use-cases/list-posts.use-case";
import { UpdatePostUseCase } from "./application/use-cases/update-post.use-case";
import { InMemoryPostRepository } from "./infrastructure/in-memory-post.repository";
import { PostgresPostRepository } from "./infrastructure/postgres-post.repository";
import { PostOrmEntity } from "./infrastructure/post.orm-entity";
import { PostsController } from "./interfaces/http/posts.controller";
import { DeletePostUseCase } from "./application/use-cases/delete-post.use-case";

@Module({
  imports: [TypeOrmModule.forFeature([PostOrmEntity]), IdempotencyModule],
  controllers: [PostsController],
  providers: [
    CreatePostUseCase,
    ListPostsUseCase,
    UpdatePostUseCase,
    GetPostUseCase,
    DeletePostUseCase,
    {
      provide: POST_REPOSITORY,
      useClass: PostgresPostRepository,
    },
  ],
  exports: [POST_REPOSITORY],
})
export class PostsModule {}
