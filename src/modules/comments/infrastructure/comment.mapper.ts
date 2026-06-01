import { Comment } from "../domain/comment.entity";
import { CommentOrmEntity } from "./comment.orm-entity";

// Mapper — cầu nối giữa Domain Entity và ORM Entity
// Nằm ở Infrastructure vì nó biết cả 2 kiểu
export class CommentMapper {
  // Domain → ORM (để lưu vào DB)
  static toOrm(comment: Comment): CommentOrmEntity {
    const c = comment.toPrimitives();
    const orm = new CommentOrmEntity();
    orm.id = c.id;
    orm.postId = c.postId;
    orm.content = c.content;
    orm.deletedAt = c.deletedAt ? new Date(c.deletedAt) : null;
    // createdAt và updatedAt do TypeORM tự quản lý (@CreateDateColumn, @UpdateDateColumn)
    return orm;
  }

  // ORM → Domain (sau khi đọc từ DB)
  static toDomain(orm: CommentOrmEntity): Comment {
    return Comment.fromPrimitives({
      id: orm.id,
      postId: orm.postId,
      content: orm.content,
      createdAt: orm.createdAt.toISOString(),
      deletedAt: orm.deletedAt ? orm.deletedAt.toISOString() : null,
    });
  }
}
