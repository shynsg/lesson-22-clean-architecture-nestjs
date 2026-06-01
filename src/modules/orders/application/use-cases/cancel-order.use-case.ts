import { Inject, Injectable } from "@nestjs/common";
import { Actor } from "../../../../shared/application/actor";
import { ForbiddenError, NotFoundError } from "../../../../shared/domain/errors";
import { OrderRbacPolicy } from "../policies/order-rbac.policy";
import {
  CANCEL_ORDER_TRANSACTION,
  CancelOrderTransaction,
} from "../ports/cancel-order-transaction.port";
import {
  ORDER_REPOSITORY,
  OrderRepository,
} from "../ports/order-repository.port";

export type CancelOrderInput = {
  orderId: string;
  actor: Actor;
};

@Injectable()
export class CancelOrderUseCase {
  constructor(
    @Inject(CANCEL_ORDER_TRANSACTION)
    private readonly cancelOrderTransaction: CancelOrderTransaction,
    @Inject(ORDER_REPOSITORY)
    private readonly orderRepository: OrderRepository,
    private readonly orderRbacPolicy: OrderRbacPolicy,
  ) {}

  async execute(input: CancelOrderInput) {
    const existingOrder = await this.orderRepository.findById(input.orderId);

    if (!existingOrder) {
      throw new NotFoundError("Order", input.orderId);
    }

    const existing = existingOrder.toPrimitives();

    if (!this.orderRbacPolicy.canCancelOrder(input.actor, existing.customerId)) {
      throw new ForbiddenError("You cannot cancel this order");
    }

    const order = await this.cancelOrderTransaction.execute(input.orderId);
    const saved = order.toPrimitives();

    return {
      order: saved,
    };
  }
}
