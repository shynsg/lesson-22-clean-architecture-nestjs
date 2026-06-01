import { Post } from "../domain/post.entity";
import { PostOrmEntity } from "./post.orm-entity";

// Mapper — cầu nối giữa Domain Entity và ORM Entity
// Nằm ở Infrastructure vì nó biết cả 2 kiểu
export class PostMapper {
  // Domain → ORM (để lưu vào DB)
  static toOrm(post: Post): PostOrmEntity {
    const p = post.toPrimitives();
    const orm = new PostOrmEntity();
    orm.id = p.id;
    orm.title = p.title;
    orm.description = p.description ?? "";
    orm.deletedAt = p.deletedAt ? new Date(p.deletedAt) : null;
    // createdAt và updatedAt do TypeORM tự quản lý (@CreateDateColumn, @UpdateDateColumn)
    return orm;
  }

  // ORM → Domain (sau khi đọc từ DB)
  static toDomain(orm: PostOrmEntity): Post {
    return Post.fromPrimitives({
      id: orm.id,
      title: orm.title,
      description: orm.description,
      createdAt: orm.createdAt.toISOString(),
      deletedAt: orm.deletedAt ? orm.deletedAt.toISOString() : null,
    });
  }
}
