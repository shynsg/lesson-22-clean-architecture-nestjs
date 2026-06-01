import { Module } from "@nestjs/common";
import { IDEMPOTENCY_REPOSITORY } from "./application/idempotency-repository.port";
import { InMemoryIdempotencyRepository } from "./infrastructure/in-memory-idempotency.repository";

@Module({
  providers: [
    {
      provide: IDEMPOTENCY_REPOSITORY,
      useClass: InMemoryIdempotencyRepository,
    },
  ],
  exports: [IDEMPOTENCY_REPOSITORY],
})
export class IdempotencyModule {}
