export const IDEMPOTENCY_REPOSITORY = Symbol("IDEMPOTENCY_REPOSITORY");

export type IdempotencyRecord<TResponse = unknown> = {
  key: string;
  requestHash: string;
  response: TResponse;
  createdAt: string;
};

export interface IdempotencyRepository {
  findByKey<TResponse>(
    key: string,
  ): Promise<IdempotencyRecord<TResponse> | null>;
  save<TResponse>(record: IdempotencyRecord<TResponse>): Promise<void>;
}
