import { CommentPrimitives } from "../../domain/comment.entity";

export class CommentPresenter {
  static toHttp(comment: CommentPrimitives) {
    return {
      id: comment.id,
      postId: comment.postId,
      content: comment.content,
      createdAt: comment.createdAt,
    };
  }
}
