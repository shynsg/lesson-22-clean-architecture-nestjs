export interface DomainEvent {
  eventId: string;
  eventType: string;
  occurredAt: string;
  aggregateType: string;
  aggregateId: string;
  payload: Record<string, unknown>;
}