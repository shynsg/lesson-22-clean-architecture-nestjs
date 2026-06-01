import { randomUUID } from "crypto";
import {
  ChargePaymentInput,
  ChargePaymentOutput,
  PaymentPort,
  RefundPaymentInput,
} from "../application/ports/payment.port";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class FakePaymentAdapter implements PaymentPort {
  private readonly logger = new Logger(FakePaymentAdapter.name);
  private readonly charges = new Map<string, string>();
  private readonly refunds = new Map<string, RefundPaymentInput>();

  async charge(input: ChargePaymentInput): Promise<ChargePaymentOutput> {
    this.logger.log(`charge orderId=${input.orderId} amount=${input.amount}`);
    if (input.orderId.includes("fail-payment")) {
      this.logger.warn(`charge failed orderId=${input.orderId}`);
      throw new Error("Payment charge failed");
    }

    const transactionId = `txn_${randomUUID()}`;
    this.charges.set(input.orderId, transactionId);
    this.logger.log(
      `charge succeeded orderId=${input.orderId} transactionId=${transactionId}`,
    );

    return {
      transactionId,
    };
  }

  async refund(input: RefundPaymentInput): Promise<void> {
    this.refunds.set(input.orderId, input);
    this.logger.warn(
      `refund orderId=${input.orderId} transactionId=${input.transactionId}`,
    );
  }

  hasCharge(orderId: string): boolean {
    return this.charges.has(orderId);
  }

  hasRefund(orderId: string): boolean {
    return this.refunds.has(orderId);
  }
}
