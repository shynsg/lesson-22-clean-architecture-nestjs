import { OutboxEvent } from "../../domain/outbox-event.entity";

export const OUTBOX_REPOSITORY = Symbol("OUTBOX_REPOSITORY");

export interface OutboxRepository {
  save(event: OutboxEvent): Promise<void>;
  claimPending(limit: number): Promise<OutboxEvent[]>;
  markPublished(id: string): Promise<void>;
  markFailed(id: string, reason: string): Promise<void>;
  findAll(): Promise<OutboxEvent[]>;
  saveMany(events: OutboxEvent[]): Promise<void>;
}
