import { Module } from "@nestjs/common";
import { EVENT_PUBLISHER } from "./application/ports/event-publisher";
import { ConsoleEventPublisher } from "./infrastructure/console-event-publisher";

@Module({
  providers: [
    {
      provide: EVENT_PUBLISHER,
      useClass: ConsoleEventPublisher,
    },
  ],
  exports: [EVENT_PUBLISHER],
})
export class MessagingModule {}
