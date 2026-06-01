import { randomUUID } from "crypto";
import { AppEvent } from "../../../shared/messaging/domain/app-event";
import { DomainEvent } from "../../../shared/domain/domain-event";

export type OutboxEventPrimitives = {
  id: string;
  topic: string;
  eventType: string;
  payload: Record<string, unknown>;
  attempts: number;
  publishedAt: string | null;
  createdAt: string;
  lockedAt: string | null;
};

export class OutboxEvent {
  constructor(
    private id: string,
    private readonly eventType: string,
    private readonly payload: Record<string, unknown>,
    private topic = "default-topic",
    private attempts = 0,
    private publishedAt: string | null = null,
    private lockedAt: string | null = null,
    private readonly createdAt = new Date().toISOString(),
  ) {}

  static create(
    eventType: string,
    payload: Record<string, unknown>,
    topic = "default-topic",
  ): OutboxEvent {
    return new OutboxEvent(randomUUID(), eventType, payload, topic);
  }

  static fromDomainEvent(
    event: DomainEvent,
    topic = "default-topic",
  ): OutboxEvent {
    return new OutboxEvent(
      event.eventId,
      event.eventType,
      event.payload,
      topic,
      0,
      null,
      null,
      event.occurredAt,
    );
  }

  markAttempted() {
    this.attempts += 1;
  }

  markPublished() {
    this.publishedAt = new Date().toISOString();
  }

  isPublished() {
    return this.publishedAt !== null;
  }

  getId(): string {
    return this.id;
  }

  static fromPrimitives(input: OutboxEventPrimitives): OutboxEvent {
    return new OutboxEvent(
      input.id,
      input.eventType,
      input.payload,
      input.topic,
      input.attempts,
      input.publishedAt,
      input.lockedAt,
      input.createdAt,
    );
  }

  toPrimitives(): OutboxEventPrimitives {
    return {
      id: this.id,
      topic: this.topic,
      eventType: this.eventType,
      payload: this.payload,
      attempts: this.attempts,
      publishedAt: this.publishedAt,
      createdAt: this.createdAt,
      lockedAt: this.lockedAt,
    };
  }

  toAppEvent(): AppEvent {
    return {
      id: this.id,
      topic: this.topic,
      type: this.eventType,
      payload: this.payload,
      occurredAt: this.createdAt,
    };
  }
}
