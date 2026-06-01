import { Inject, Injectable, Logger } from "@nestjs/common";
import {
  EVENT_PUBLISHER,
  EventPublisher,
} from "../../../../shared/messaging/application/ports/event-publisher";
import { OUTBOX_REPOSITORY, OutboxRepository } from "../ports/outbox.repository";

@Injectable()
export class PublishOutboxEventsUseCase {
  private readonly logger = new Logger(PublishOutboxEventsUseCase.name);

  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: OutboxRepository,
    @Inject(EVENT_PUBLISHER)
    private readonly publisher: EventPublisher
  ) {}

  async execute(input: { limit?: number } = {}) {
    const events = await this.outbox.claimPending(input.limit ?? 10);
    let published = 0;
    let failed = 0;

    if (events.length > 0) {
      this.logger.log(`Claimed ${events.length} outbox event(s).`);
    }

    for (const event of events) {
      const id = event.getId();
      const data = event.toPrimitives();

      try {
        this.logger.log(`Publishing outbox event id=${id} type=${data.eventType}.`);
        await this.publisher.publish(event.toAppEvent());
        await this.outbox.markPublished(id);
        this.logger.log(`Published outbox event id=${id}.`);
        published += 1;
      } catch (error) {
        const reason = error instanceof Error ? error.message : "Unknown publish error";

        await this.outbox.markFailed(
          id,
          reason,
        );
        this.logger.error(`Failed to publish outbox event id=${id}: ${reason}`);
        failed += 1;
      }
    }

    return {
      claimed: events.length,
      published,
      failed,
    };
  }
}
