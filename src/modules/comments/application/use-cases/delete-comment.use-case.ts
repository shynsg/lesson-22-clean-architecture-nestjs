import { Inject, Injectable } from "@nestjs/common";
import { NotFoundError } from "../../../../shared/domain/errors";
import {
  POST_REPOSITORY,
  PostRepository,
} from "../../../posts/application/ports/post.repository";
import {
  COMMENT_REPOSITORY,
  CommentRepository,
} from "../ports/comment.repository";

export type DeleteCommentsInput = {
  postId: string;
  commentId: string;
};

@Injectable()
export class DeleteCommentsUseCase {
  constructor(
    @Inject(COMMENT_REPOSITORY)
    private readonly comments: CommentRepository,
    @Inject(POST_REPOSITORY)
    private readonly posts: PostRepository,
  ) {}

  async execute(input: DeleteCommentsInput): Promise<void> {
    const post = await this.posts.findById(input.postId);

    if (!post || post.isDeleted())
      throw new NotFoundError("Post", input.postId);

    const comment = await this.comments.findById(input.commentId);

    if (!comment || comment.isDeleted())
      throw new NotFoundError("Comment", input.commentId);

    comment.delete();

    await this.comments.save(comment);
  }
}
