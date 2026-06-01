import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PostsModule } from "../posts/posts.module";
import { COMMENT_REPOSITORY } from "./application/ports/comment.repository";
import { CreateCommentUseCase } from "./application/use-cases/create-comment.use-case";
import { DeleteCommentsUseCase } from "./application/use-cases/delete-comment.use-case";
import { GetCommentsUseCase } from "./application/use-cases/get-comment.use-case";
import { CommentOrmEntity } from "./infrastructure/comment.orm-entity";
import { PostgresCommentRepository } from "./infrastructure/postgres-comment.repository";
import { CommentsController } from "./interfaces/http/comment.controller";

@Module({
  imports: [PostsModule, TypeOrmModule.forFeature([CommentOrmEntity])],
  controllers: [CommentsController],
  providers: [
    CreateCommentUseCase,
    GetCommentsUseCase,
    DeleteCommentsUseCase,
    {
      provide: COMMENT_REPOSITORY,
      useClass: PostgresCommentRepository,
    },
  ],
})
export class CommentModule {}
