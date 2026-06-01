import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";

@Entity("comments")
export class CommentOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Index("IDX_comments_post_id")
  @Column({ name: "post_id", type: "uuid" })
  postId!: string;

  @Column({ type: "text" })
  content!: string;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;

  // null = chưa xóa, có giá trị = đã soft delete
  @DeleteDateColumn({ name: "deleted_at", type: "timestamptz", nullable: true })
  deletedAt!: Date | null;
}
