import { Column, CreateDateColumn, Entity, PrimaryColumn } from "typeorm";

@Entity("outbox_events")
export class OutboxEventOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ type: "varchar" })
  topic!: string;

  @Column({ name: "event_type", type: "varchar" })
  eventType!: string;

  @Column({ type: "jsonb" })
  payload!: Record<string, unknown>;

  @Column({ type: "int", default: 0 })
  attempts!: number;

  @Column({ name: "published_at", type: "timestamptz", nullable: true })
  publishedAt!: string | null;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @Column({ name: "locked_at", type: "timestamptz", nullable: true })
  lockedAt!: string | null;
}
