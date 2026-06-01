import { OutboxRepository } from "../application/ports/outbox.repository";
import { OutboxEvent, OutboxEventPrimitives } from "../domain/outbox-event.entity";

export class InMemoryOutboxRepository implements OutboxRepository {
  private readonly events = new Map<string, OutboxEventPrimitives>();

  async save(event: OutboxEvent): Promise<void> {
    this.events.set(event.toPrimitives().id, event.toPrimitives());
  }

  async saveMany(events: OutboxEvent[]): Promise<void> {
    for (const event of events) {
      await this.save(event);
    }
  }

  async claimPending(limit: number): Promise<OutboxEvent[]> {
    const now = new Date().toISOString();
    const claimed = Array.from(this.events.values())
      .filter((e) => !e.publishedAt && !e.lockedAt)
      .slice(0, limit);

    for (const event of claimed) {
      this.events.set(event.id, {
        ...event,
        attempts: event.attempts + 1,
        lockedAt: now,
      });
    }

    return claimed.map((event) =>
      OutboxEvent.fromPrimitives({
        ...event,
        attempts: event.attempts + 1,
        lockedAt: now,
      }),
    );
  }

  async markPublished(id: string): Promise<void> {
    const event = this.events.get(id);
    if (!event) return;

    this.events.set(id, {
      ...event,
      publishedAt: new Date().toISOString(),
      lockedAt: null,
    });
  }

  async markFailed(id: string, _reason: string): Promise<void> {
    const event = this.events.get(id);
    if (!event) return;

    this.events.set(id, {
      ...event,
      lockedAt: null,
    });
  }

  async findAll(): Promise<OutboxEvent[]> {
    return Array.from(this.events.values()).map((e) => OutboxEvent.fromPrimitives(e));
  }
}
