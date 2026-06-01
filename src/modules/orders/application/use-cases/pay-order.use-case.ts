import { Inject, Injectable } from "@nestjs/common";
import {
  PAY_ORDER_TRANSACTION,
  PayOrderTransaction,
} from "../ports/pay-order-transaction.port";

export type PayOrderInput = {
  orderId: string;
};

@Injectable()
export class PayOrderUseCase {
  constructor(
    @Inject(PAY_ORDER_TRANSACTION)
    private readonly payOrderTransaction: PayOrderTransaction,
  ) {}

  async execute(input: PayOrderInput) {
    const order = await this.payOrderTransaction.execute(input.orderId);
    const saved = order.toPrimitives();

    return {
      order: saved,
    };
  }
}
