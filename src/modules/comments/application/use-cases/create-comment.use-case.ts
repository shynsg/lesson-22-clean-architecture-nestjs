import { Inject, Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { Comment, CommentPrimitives } from "../../domain/comment.entity";
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from "../ports/comment.repository";
import { NotFoundError } from "../../../../shared/domain/errors";
import {
  POST_REPOSITORY,
  PostRepository,
} from "../../../posts/application/ports/post.repository";

export type CreateCommentInput = {
  postId: string;
  content: string;
};

export type CreateCommentOutput = {
  comment: CommentPrimitives;
};

@Injectable()
export class CreateCommentUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly comments: CommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(input: CreateCommentInput): Promise<CreateCommentOutput> {
    const post = await this.posts.findById(input.postId);

    if (!post || post.isDeleted())
      throw new NotFoundError("Post", input.postId);

    const comment = Comment.create({
      id: randomUUID(),
      postId: input.postId,
      content: input.content,
    });

    await this.comments.save(comment);

    return {
      comment: comment.toPrimitives(),
    };
  }
}
