import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OutboxRepository } from "../application/ports/outbox.repository";
import { OutboxEvent } from "../domain/outbox-event.entity";
import { OutboxMapper } from "./outbox.mapper";
import { OutboxEventOrmEntity } from "./outbox.orm-entity";

export class PostgresOutboxEventRepository implements OutboxRepository {
  constructor(
    @InjectRepository(OutboxEventOrmEntity)
    private readonly repo: Repository<OutboxEventOrmEntity>,
  ) {}

  async save(event: OutboxEvent): Promise<void> {
    const orm = OutboxMapper.toOrm(event);
    await this.repo.save(orm);
  }

  async findAll(): Promise<OutboxEvent[]> {
    const ormEntities = await this.repo.find();
    return ormEntities.map(OutboxMapper.toDomain);
  }

  async claimPending(limit: number): Promise<OutboxEvent[]> {
    const result = await this.repo.query(
      `
      WITH claimed AS (
        SELECT id
        FROM outbox_events
        WHERE published_at IS NULL
          AND (
            locked_at IS NULL
            OR locked_at < now() - interval '30 seconds'
          )
        ORDER BY created_at ASC
        LIMIT $1
        FOR UPDATE SKIP LOCKED
      )
      UPDATE outbox_events
      SET locked_at = now(),
          attempts = attempts + 1
      FROM claimed
      WHERE outbox_events.id = claimed.id
      RETURNING
        outbox_events.id AS "id",
        outbox_events.topic AS "topic",
        outbox_events.event_type AS "eventType",
        outbox_events.payload AS "payload",
        outbox_events.attempts AS "attempts",
        outbox_events.published_at AS "publishedAt",
        outbox_events.created_at AS "createdAt",
        outbox_events.locked_at AS "lockedAt"
      `,
      [limit],
    );
    const rows = normalizeQueryRows<ClaimedOutboxRow>(result);

    return rows.map((row) =>
      OutboxEvent.fromPrimitives({
        id: row.id,
        topic: row.topic,
        eventType: row.eventType,
        payload: row.payload,
        attempts: row.attempts,
        publishedAt: toIsoStringOrNull(row.publishedAt),
        createdAt: toIsoString(row.createdAt),
        lockedAt: toIsoStringOrNull(row.lockedAt),
      }),
    );
  }

  async markPublished(id: string): Promise<void> {
    await this.repo.update(
      { id },
      {
        publishedAt: new Date().toISOString(),
        lockedAt: null,
      },
    );
  }

  async markFailed(id: string, _reason: string): Promise<void> {
    await this.repo.update(
      { id },
      {
        lockedAt: null,
      },
    );
  }

  async saveMany(events: OutboxEvent[]): Promise<void> {
    if (events.length === 0) return;

    const rows = events.map((event) => OutboxMapper.toOrm(event));

    await this.repo.save(rows);
  }
}

function toIsoString(value: Date | string): string {
  return value instanceof Date ? value.toISOString() : value;
}

function toIsoStringOrNull(value: Date | string | null): string | null {
  if (value === null) return null;
  return toIsoString(value);
}

type ClaimedOutboxRow = {
  id: string;
  topic: string;
  eventType: string;
  payload: Record<string, unknown>;
  attempts: number;
  publishedAt: Date | string | null;
  createdAt: Date | string;
  lockedAt: Date | string | null;
};

function normalizeQueryRows<T>(result: unknown): T[] {
  if (Array.isArray(result) && Array.isArray(result[0])) {
    return result[0] as T[];
  }

  return result as T[];
}
