import { OutboxEvent } from "../domain/outbox-event.entity";
import { OutboxEventOrmEntity } from "./outbox.orm-entity";

export class OutboxMapper {
  static toOrm(event: OutboxEvent): OutboxEventOrmEntity {
    const p = event.toPrimitives();
    const orm = new OutboxEventOrmEntity();
    orm.id = p.id;
    orm.topic = p.topic;
    orm.eventType = p.eventType;
    orm.payload = p.payload;
    orm.attempts = p.attempts;
    orm.publishedAt = p.publishedAt;
    orm.lockedAt = p.lockedAt;
    return orm;
  }

  static toDomain(orm: OutboxEventOrmEntity): OutboxEvent {
    return OutboxEvent.fromPrimitives({
      id: orm.id,
      topic: orm.topic,
      eventType: orm.eventType,
      payload: orm.payload,
      attempts: orm.attempts,
      publishedAt: orm.publishedAt,
      createdAt: orm.createdAt.toISOString(),
      lockedAt: orm.lockedAt,
    });
  }
}
