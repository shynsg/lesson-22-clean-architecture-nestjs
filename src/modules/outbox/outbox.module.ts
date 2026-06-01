import { Global, Module } from "@nestjs/common";
import { OUTBOX_REPOSITORY } from "./application/ports/outbox.repository";
import { PublishOutboxEventsUseCase } from "./application/use-cases/publish-outbox-events.use-case";
import { ListOutboxEventsUseCase } from "./application/use-cases/list-outbox-events.use-case";
import { PostgresOutboxEventRepository } from "./infrastructure/postgres-outbox.repository";
import { OutboxController } from "./interfaces/http/outbox.controller";
import { OutboxWorker } from "./interfaces/workers/outbox.worker";
import { TypeOrmModule } from "@nestjs/typeorm";
import { OutboxEventOrmEntity } from "./infrastructure/outbox.orm-entity";
import { MessagingModule } from "../../shared/messaging/messaging.module";

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([OutboxEventOrmEntity]), MessagingModule],
  controllers: [OutboxController],
  providers: [
    PublishOutboxEventsUseCase,
    ListOutboxEventsUseCase,
    OutboxWorker,
    {
      provide: OUTBOX_REPOSITORY,
      useClass: PostgresOutboxEventRepository,
      // useClass: InMemoryOutboxRepository
    },
  ],
  exports: [OUTBOX_REPOSITORY, PublishOutboxEventsUseCase],
})
export class OutboxModule {}
