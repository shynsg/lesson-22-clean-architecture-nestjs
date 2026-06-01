import { EventPublisher } from "../application/ports/event-publisher";
import { AppEvent } from "../domain/app-event";

export class ConsoleEventPublisher implements EventPublisher {
  async publish(event: AppEvent): Promise<void> {
    console.log("[fake-publish]", {
      id: event.id,
      topic: event.topic,
      type: event.type,
      payload: event.payload,
      occurredAt: event.occurredAt,
    });
  }
}
