import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { PublishOutboxEventsUseCase } from "../../application/use-cases/publish-outbox-events.use-case";

@Injectable()
export class OutboxWorker implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(OutboxWorker.name);
  private timer: NodeJS.Timeout | null = null;

  constructor(
    private readonly publishOutboxEventsUseCase: PublishOutboxEventsUseCase,
  ) {}

  onModuleInit() {
    this.logger.log("Worker started. Polling outbox every 30000ms.");

    this.timer = setInterval(() => {
      this.logger.debug("Polling outbox events.");

      void this.publishOutboxEventsUseCase
        .execute()
        .then((result) => {
          if (result.claimed > 0 || result.failed > 0) {
            this.logger.log(
              `Outbox tick completed. claimed=${result.claimed} published=${result.published} failed=${result.failed}`,
            );
          }
        })
        .catch((error) => {
          this.logger.error(
            `Outbox worker tick failed: ${error instanceof Error ? error.message : String(error)}`,
          );
        });
    }, 30000);
  }

  onModuleDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.logger.log("Worker stopped.");
    }
  }
}
