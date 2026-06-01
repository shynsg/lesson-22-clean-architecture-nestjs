import { Controller, Get } from "@nestjs/common";
import { ListOutboxEventsUseCase } from "../../application/use-cases/list-outbox-events.use-case";

@Controller("outbox")
export class OutboxController {
  constructor(
    private readonly listOutboxEventsUseCase: ListOutboxEventsUseCase,
  ) {}

  @Get("events")
  async list() {
    return {
      events: await this.listOutboxEventsUseCase.execute(),
    };
  }
}
