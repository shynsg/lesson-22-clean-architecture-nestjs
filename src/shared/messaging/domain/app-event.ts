export type AppEvent = {
  id: string;
  topic: string;
  type: string;
  payload: Record<string, unknown>;
  occurredAt: string;
};
