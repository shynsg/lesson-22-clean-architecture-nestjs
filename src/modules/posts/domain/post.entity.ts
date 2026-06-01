import { DomainError } from "../../../shared/domain/errors";

export type PostPrimitives = {
  id: string;
  title: string;
  description: string | null;
  createdAt: string;
  deletedAt: string | null;
};

export class Post {
  private constructor(
    private readonly id: string,
    private title: string,
    private description: string | null = null,
    private readonly createdAt: string,
    private deletedAt: string | null = null,
  ) {}

  static create(input: { id: string; title: string; description: string }) {
    const title = String(input.title || "").trim();
    const description = String(input.description || "").trim();

    if (!title) {
      throw new DomainError("Post title is required");
    }

    if (title.length > 120) {
      throw new DomainError("Post title must be 120 characters or less");
    }

    if (!description) {
      throw new DomainError("Post description is required");
    }

    return new Post(
      input.id,
      title,
      description,
      new Date().toISOString(),
      null,
    );
  }

  update(input: { title?: string; description?: string }): void {
    if (this.deletedAt !== null) {
      throw new DomainError("Cannot update a deleted post");
    }
    if (input.title !== undefined) {
      const title = input.title.trim();
      if (!title) throw new DomainError("Post title is required");
      if (title.length > 120)
        throw new DomainError("Post title must be 120 characters or less");
      this.title = title;
    }
    this.description = input.description || "";
  }

  delete(): void {
    if (this.deletedAt !== null) {
      throw new DomainError("Post is already deleted");
    }
    this.deletedAt = new Date().toISOString();
  }

  isDeleted(): boolean {
    return this.deletedAt !== null;
  }

  static fromPrimitives(input: PostPrimitives): Post {
    return new Post(
      input.id,
      input.title,
      input.description,
      input.createdAt,
      input.deletedAt,
    );
  }

  toPrimitives(): PostPrimitives {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      createdAt: this.createdAt,
      deletedAt: this.deletedAt,
    };
  }
}
