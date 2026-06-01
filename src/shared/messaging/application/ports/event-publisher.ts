import { AppEvent } from "../../domain/app-event";

export const EVENT_PUBLISHER = Symbol("EVENT_PUBLISHER");

export interface EventPublisher {
  publish(event: AppEvent): Promise<void>;
}
