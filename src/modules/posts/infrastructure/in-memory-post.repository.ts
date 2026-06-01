import { Post, PostPrimitives } from "../domain/post.entity";
import { PostRepository } from "../application/ports/post.repository";

const SEED_POSTS: PostPrimitives[] = [
  {
    id: "post-001",
    title: "Getting Started with NestJS",
    description:
      "Learn how to build scalable server-side applications with NestJS framework.",
    createdAt: "2024-01-01T08:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-002",
    title: "Clean Architecture in TypeScript",
    description:
      "A deep dive into applying Clean Architecture principles in a TypeScript project.",
    createdAt: "2024-01-02T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-003",
    title: "Understanding Dependency Injection",
    description: "How DI works in NestJS and why it matters for testable code.",
    createdAt: "2024-01-03T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-004",
    title: "Domain-Driven Design Basics",
    description:
      "Entities, Value Objects, Aggregates — the building blocks of DDD.",
    createdAt: "2024-01-04T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-005",
    title: "Repository Pattern Explained",
    description:
      "Why you should abstract your data access layer with the Repository pattern.",
    createdAt: "2024-01-05T12:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-006",
    title: "Use Cases vs Services",
    description:
      "What is a Use Case and how is it different from a traditional Service class?",
    createdAt: "2024-01-06T13:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-007",
    title: "Ports and Adapters Pattern",
    description:
      "The Hexagonal Architecture pattern and how it maps to Clean Architecture layers.",
    createdAt: "2024-01-07T14:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-008",
    title: "Soft Delete vs Hard Delete",
    description:
      "When to use soft delete and how to implement it cleanly in your domain.",
    createdAt: "2024-01-08T15:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-009",
    title: "Idempotency in REST APIs",
    description:
      "How to guarantee your POST endpoints are safe to retry using Idempotency Keys.",
    createdAt: "2024-01-09T16:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "post-010",
    title: "Transactional Outbox Pattern",
    description:
      "Reliably publish domain events using the Outbox pattern with a background worker.",
    createdAt: "2024-01-10T17:00:00.000Z",
    deletedAt: null,
  },
];

export class InMemoryPostRepository implements PostRepository {
  private readonly posts = new Map<string, PostPrimitives>(
    SEED_POSTS.map((p) => [p.id, p]),
  );

  async save(post: Post): Promise<void> {
    const data = post.toPrimitives();
    this.posts.set(data.id, data);
  }

  async findById(id: string): Promise<Post | null> {
    const data = this.posts.get(id);
    return data ? Post.fromPrimitives(data) : null;
  }

  async findAll(): Promise<Post[]> {
    return Array.from(this.posts.values())
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((data) => Post.fromPrimitives(data));
  }
}
