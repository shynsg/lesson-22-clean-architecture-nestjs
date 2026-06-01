import { DomainError } from "../../../../shared/domain/errors";
import { Order } from "../order.entity";

const CANCEL_WINDOW_IN_MINUTES = 30;

export class CanCancelOrderSpecification {
  check(order: Order, now = new Date()): void {
    const data = order.toPrimitives();
    const createdAt = new Date(data.createdAt).getTime();
    const cancelWindow = CANCEL_WINDOW_IN_MINUTES * 60 * 1000;

    if (now.getTime() - createdAt > cancelWindow) {
      throw new DomainError(
        `Order can only be canceled within ${CANCEL_WINDOW_IN_MINUTES} minutes`,
      );
    }
  }
}
