import { Inject, Injectable } from "@nestjs/common";
import { CommentPrimitives } from "../../domain/comment.entity";
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from "../ports/comment.repository";
import {
  POST_REPOSITORY,
  PostRepository,
} from "../../../posts/application/ports/post.repository";
import { NotFoundError } from "../../../../shared/domain/errors";

export type GetCommentsInput = {
  postId: string;
};

export type GetCommentsOutput = {
  comments: CommentPrimitives[];
};

@Injectable()
export class GetCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly comments: CommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(input: GetCommentsInput): Promise<GetCommentsOutput> {
    const post = await this.posts.findById(input.postId);

    if (!post || post.isDeleted())
      throw new NotFoundError("Post", input.postId);

    const comments = await this.comments.findAll(input.postId);

    return {
      comments: comments.map((cmt) => cmt.toPrimitives()),
    };
  }
}
