import { Comment, CommentPrimitives } from "../../domain/comment.entity";

export const COMMENT_REPOSITORY = Symbol("COMMENT_REPOSITORY");

export interface CommentRepository {
  save(comment: Comment): Promise<void>;
  findAll(postId: string): Promise<Comment[]>;
  findById(commentId: string): Promise<Comment | null>;
}
