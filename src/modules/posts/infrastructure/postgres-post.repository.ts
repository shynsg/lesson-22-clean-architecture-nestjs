import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Post } from "../domain/post.entity";
import { PostRepository } from "../application/ports/post.repository";
import { PostOrmEntity } from "./post.orm-entity";
import { PostMapper } from "./post.mapper";

// PostgreSQL implementation của PostRepository port
// Đây là nơi DUY NHẤT biết về TypeORM và SQL
export class PostgresPostRepository implements PostRepository {
  constructor(
    @InjectRepository(PostOrmEntity)
    private readonly repo: Repository<PostOrmEntity>,
  ) {}

  async save(post: Post): Promise<void> {
    const orm = PostMapper.toOrm(post);
    await this.repo.save(orm);
  }

  async findById(id: string): Promise<Post | null> {
    // withDeleted: true → lấy cả soft-deleted để use case tự quyết định
    const orm = await this.repo.findOne({
      where: { id },
      withDeleted: true,
    });
    if (!orm) return null;
    return PostMapper.toDomain(orm);
  }

  async findAll(): Promise<Post[]> {
    // Không withDeleted → TypeORM tự WHERE deleted_at IS NULL
    const orms = await this.repo.find({
      order: { createdAt: "DESC" },
    });
    return orms.map(PostMapper.toDomain);
  }
}
