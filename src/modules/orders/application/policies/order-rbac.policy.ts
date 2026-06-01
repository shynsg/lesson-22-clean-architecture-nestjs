import { Injectable } from "@nestjs/common";
import { Actor, ActorRole } from "../../../../shared/application/actor";

@Injectable()
export class OrderRbacPolicy {
  canCancelOrder(actor: Actor, orderOwnerId: string): boolean {
    if (actor.role === ActorRole.ADMIN) {
      return true;
    }

    if (actor.role === ActorRole.USER) {
      return actor.id === orderOwnerId;
    }

    return false;
  }
}
