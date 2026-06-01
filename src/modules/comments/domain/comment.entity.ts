import { DomainError } from "../../../shared/domain/errors";

export type CommentPrimitives = {
  id: string;
  content: string;
  postId: string;
  createdAt: string;
  deletedAt: string | null;
};

export class Comment {
  private constructor(
    private readonly id: string,
    private readonly postId: string,
    private content: string,
    private readonly createdAt: string,
    private deletedAt: string | null,
  ) {}

  static create(input: { id: string; postId: string; content: string }) {
    const content = String(input.content || "").trim();

    if (!content) {
      throw new DomainError("Content can't empty");
    }

    if (content.length > 1000) {
      throw new DomainError("Content can't over 1000 characters");
    }

    return new Comment(
      input.id,
      input.postId,
      content,
      new Date().toISOString(),
      null,
    );
  }

  static fromPrimitives(input: CommentPrimitives): Comment {
    return new Comment(
      input.id,
      input.postId,
      input.content,
      input.createdAt,
      input.deletedAt,
    );
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  delete(): void {
    if (this.deletedAt !== null)
      throw new DomainError("Comment is already deleted");
    this.deletedAt = new Date().toISOString();
  }

  toPrimitives(): CommentPrimitives {
    return {
      id: this.id,
      postId: this.postId,
      content: this.content,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
    };
  }
}
