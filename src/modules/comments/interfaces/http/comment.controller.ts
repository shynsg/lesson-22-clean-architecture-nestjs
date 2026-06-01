import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseFilters,
} from "@nestjs/common";
import { CreateCommentUseCase } from "../../application/use-cases/create-comment.use-case";
import { GetCommentsUseCase } from "../../application/use-cases/get-comment.use-case";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { CommentPresenter } from "./comment.presenter";
import { DeleteCommentsUseCase } from "../../application/use-cases/delete-comment.use-case";

@Controller("posts/:postId/comments")
export class CommentsController {
  constructor(
    private readonly createCommentUseCase: CreateCommentUseCase,
    private readonly getCommentUseCase: GetCommentsUseCase,
    private readonly deleteCommentsUseCase: DeleteCommentsUseCase,
  ) {}

  @Post()
  async create(@Param("postId") postId: string, @Body() dto: CreateCommentDto) {
    const result = await this.createCommentUseCase.execute({
      postId,
      content: dto.content,
    });

    return {
      comment: CommentPresenter.toHttp(result.comment),
    };
  }

  @Get()
  async getAllComment(@Param("postId") postId: string) {
    const result = await this.getCommentUseCase.execute({ postId });

    return {
      comments: result.comments.map((cmt) => CommentPresenter.toHttp(cmt)),
    };
  }

  @Delete(":commentId")
  async delete(
    @Param("postId") postId: string,
    @Param("commentId") commentId: string,
  ) {
    return await this.deleteCommentsUseCase.execute({ commentId, postId });
  }
}
