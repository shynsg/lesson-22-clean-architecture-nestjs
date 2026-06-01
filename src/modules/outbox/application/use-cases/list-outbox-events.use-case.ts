import { Inject, Injectable } from "@nestjs/common";
import { OUTBOX_REPOSITORY, OutboxRepository } from "../ports/outbox.repository";

@Injectable()
export class ListOutboxEventsUseCase {
  constructor(
    @Inject(OUTBOX_REPOSITORY)
    private readonly outbox: OutboxRepository,
  ) {}

  async execute() {
    return this.outbox.findAll();
  }
}
