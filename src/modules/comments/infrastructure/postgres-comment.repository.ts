import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CommentRepository } from "../application/ports/comment.repository";
import { CommentOrmEntity } from "./comment.orm-entity";
import { Comment } from "../domain/comment.entity";
import { CommentMapper } from "./comment.mapper";

export class PostgresCommentRepository implements CommentRepository {
  constructor(
    @InjectRepository(CommentOrmEntity)
    private readonly repo: Repository<CommentOrmEntity>,
  ) {}

  async save(comment: Comment): Promise<void> {
    const orm = CommentMapper.toOrm(comment);
    await this.repo.save(orm);
  }

  async findAll(postId: string): Promise<Comment[]> {
    const orms = await this.repo.find({
      where: {
        postId,
      },
    });

    return orms.map(CommentMapper.toDomain);
  }

  async findById(id: string): Promise<Comment | null> {
    const orm = await this.repo.findOne({
      where: {
        id,
      },
      withDeleted: true,
    });

    if (!orm) return null;

    return CommentMapper.toDomain(orm);
  }
}
