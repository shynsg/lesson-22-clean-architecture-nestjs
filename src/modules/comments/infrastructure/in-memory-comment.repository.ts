import { Comment, CommentPrimitives } from "../domain/comment.entity";
import { CommentRepository } from "../application/ports/comment.repository";

// postId dùng đúng ids từ seed posts (post-001 đến post-010)
const SEED_COMMENTS: CommentPrimitives[] = [
  {
    id: "cmt-001",
    postId: "post-001",
    content: "Great intro to NestJS! Really helped me get started.",
    createdAt: "2024-01-01T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-002",
    postId: "post-001",
    content: "Could you add a section about NestJS guards?",
    createdAt: "2024-01-01T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-003",
    postId: "post-001",
    content: "I've been using NestJS for 2 years, this is a solid overview.",
    createdAt: "2024-01-01T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-004",
    postId: "post-001",
    content: "The module system in NestJS is very elegant compared to Express.",
    createdAt: "2024-01-01T12:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-005",
    postId: "post-002",
    content:
      "Clean Architecture took me a while to understand but this makes it clear.",
    createdAt: "2024-01-02T09:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-006",
    postId: "post-002",
    content: "How do you handle circular dependencies between modules?",
    createdAt: "2024-01-02T10:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-007",
    postId: "post-002",
    content: "The layer diagram is very helpful, bookmarked!",
    createdAt: "2024-01-02T11:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-008",
    postId: "post-002",
    content: "Does this scale well for microservices?",
    createdAt: "2024-01-02T12:30:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-009",
    postId: "post-003",
    content: "DI is a game changer for testable code. Great explanation.",
    createdAt: "2024-01-03T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-010",
    postId: "post-003",
    content: "Does NestJS support property injection as well?",
    createdAt: "2024-01-03T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-011",
    postId: "post-003",
    content: "I struggled with circular dependency injection. Any tips?",
    createdAt: "2024-01-03T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-012",
    postId: "post-004",
    content: "DDD is complex but you explained Aggregates really well.",
    createdAt: "2024-01-04T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-013",
    postId: "post-004",
    content: "Can Value Objects have methods or just data?",
    createdAt: "2024-01-04T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-014",
    postId: "post-004",
    content: "What's the difference between Aggregate and Entity?",
    createdAt: "2024-01-04T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-015",
    postId: "post-005",
    content: "Repository pattern was confusing before, now it clicks.",
    createdAt: "2024-01-05T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-016",
    postId: "post-005",
    content: "Should the repository return domain entities or DTOs?",
    createdAt: "2024-01-05T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-017",
    postId: "post-005",
    content: "How do you unit test the repository adapter?",
    createdAt: "2024-01-05T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-018",
    postId: "post-006",
    content: "Use Cases over Services any day. Much cleaner code.",
    createdAt: "2024-01-06T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-019",
    postId: "post-006",
    content: "What about use cases that need to call other use cases?",
    createdAt: "2024-01-06T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-020",
    postId: "post-006",
    content: "Should use cases be aware of transactions?",
    createdAt: "2024-01-06T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-021",
    postId: "post-007",
    content: "Hexagonal Architecture finally makes sense to me!",
    createdAt: "2024-01-07T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-022",
    postId: "post-007",
    content: "Is Ports and Adapters the same as Clean Architecture?",
    createdAt: "2024-01-07T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-023",
    postId: "post-007",
    content: "Great visual representation of the layers.",
    createdAt: "2024-01-07T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-024",
    postId: "post-008",
    content: "We switched to soft delete last month, best decision ever.",
    createdAt: "2024-01-08T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-025",
    postId: "post-008",
    content: "How do you handle restoring soft deleted records?",
    createdAt: "2024-01-08T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-026",
    postId: "post-008",
    content: "Should soft deleted records show up in foreign key lookups?",
    createdAt: "2024-01-08T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-027",
    postId: "post-008",
    content: "We use a status field instead of deletedAt, same concept.",
    createdAt: "2024-01-08T12:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-028",
    postId: "post-009",
    content: "Idempotency keys saved us from double charging customers!",
    createdAt: "2024-01-09T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-029",
    postId: "post-009",
    content: "Should idempotency keys expire after a certain time?",
    createdAt: "2024-01-09T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-030",
    postId: "post-009",
    content: "How do you store idempotency keys in PostgreSQL efficiently?",
    createdAt: "2024-01-09T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-031",
    postId: "post-010",
    content: "Outbox pattern is essential for reliable event publishing.",
    createdAt: "2024-01-10T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-032",
    postId: "post-010",
    content: "How often should the outbox worker poll for new events?",
    createdAt: "2024-01-10T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-033",
    postId: "post-010",
    content: "What happens if the outbox worker crashes mid-publish?",
    createdAt: "2024-01-10T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-034",
    postId: "post-010",
    content: "Can you use Kafka instead of polling for the outbox pattern?",
    createdAt: "2024-01-10T12:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-035",
    postId: "post-001",
    content: "Would love a follow-up post on NestJS interceptors.",
    createdAt: "2024-01-11T09:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-036",
    postId: "post-002",
    content: "Applied this pattern at work, team loves it.",
    createdAt: "2024-01-11T10:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-037",
    postId: "post-003",
    content: "Scoped vs singleton providers tripped me up at first.",
    createdAt: "2024-01-11T11:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-038",
    postId: "post-005",
    content: "Generic repository interfaces are so clean in TypeScript.",
    createdAt: "2024-01-11T12:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-039",
    postId: "post-007",
    content: "The adapter pattern for external services is underrated.",
    createdAt: "2024-01-11T13:00:00.000Z",
    deletedAt: null,
  },
  {
    id: "cmt-040",
    postId: "post-010",
    content: "At-least-once delivery is key for financial systems.",
    createdAt: "2024-01-11T14:00:00.000Z",
    deletedAt: null,
  },
];

export class InMemoryCommentRepository implements CommentRepository {
  private readonly comments = new Map<string, CommentPrimitives>(
    SEED_COMMENTS.map((c) => [c.id, c]),
  );

  async save(comment: Comment): Promise<void> {
    const data = comment.toPrimitives();
    this.comments.set(data.id, data);
  }

  async findAll(postId: string): Promise<Comment[]> {
    return Array.from(this.comments.values())
      .filter(
        (comment) => comment.postId === postId && comment.deletedAt === null,
      )
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .map((cmt) => Comment.fromPrimitives(cmt));
  }

  async findById(commentId: string): Promise<Comment | null> {
    const commnent = this.comments.get(commentId);
    return commnent ? Comment.fromPrimitives(commnent) : null;
  }
}
