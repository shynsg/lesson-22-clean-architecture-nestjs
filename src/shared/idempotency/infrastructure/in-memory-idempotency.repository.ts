import {
  IdempotencyRecord,
  IdempotencyRepository,
} from "../application/idempotency-repository.port";

export class InMemoryIdempotencyRepository implements IdempotencyRepository {
  private readonly records = new Map<string, IdempotencyRecord>();

  async findByKey<TResponse>(
    key: string,
  ): Promise<IdempotencyRecord<TResponse> | null> {
    return (
      (this.records.get(key) as IdempotencyRecord<TResponse> | undefined) ??
      null
    );
  }

  async save<TResponse>(record: IdempotencyRecord<TResponse>): Promise<void> {
    this.records.set(record.key, record);
  }
}
