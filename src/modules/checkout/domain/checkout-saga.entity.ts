import { randomUUID } from "crypto";
import { DomainError } from "../../../shared/domain/errors";

export enum CheckoutSagaStatus {
  WAITING_STOCK = "WAITING_STOCK",
  WAITING_PAYMENT = "WAITING_PAYMENT",
  WAITING_SHIPPING = "WAITING_SHIPPING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export type CheckoutSagaPrimitives = {
  id: string;
  orderId: string;
  status: CheckoutSagaStatus;
  paymentTransactionId: string | null;
  shipmentId: string | null;
  failureReason: string | null;
  createdAt: string;
  updatedAt: string;
};

export class CheckoutSaga {
  private constructor(
    private readonly id: string,
    private readonly orderId: string,
    private status: CheckoutSagaStatus,
    private paymentTransactionId: string | null,
    private shipmentId: string | null,
    private failureReason: string | null,
    private readonly createdAt: string,
    private updatedAt: string,
  ) {}

  static start(input: { orderId: string }): CheckoutSaga {
    const orderId = String(input.orderId || "").trim();

    if (!orderId) {
      throw new DomainError("orderId is required");
    }

    const now = new Date().toISOString();

    return new CheckoutSaga(
      randomUUID(),
      orderId,
      CheckoutSagaStatus.WAITING_STOCK,
      null,
      null,
      null,
      now,
      now,
    );
  }

  static fromPrimitives(input: CheckoutSagaPrimitives): CheckoutSaga {
    const saga = new CheckoutSaga(
      input.id,
      input.orderId,
      input.status,
      input.paymentTransactionId,
      input.shipmentId,
      input.failureReason,
      input.createdAt,
      input.updatedAt,
    );

    saga.ensureValidState();

    return saga;
  }

  private ensureValidState(): void {
    if (
      this.status === CheckoutSagaStatus.WAITING_SHIPPING &&
      !this.paymentTransactionId
    ) {
      throw new DomainError(
        "Checkout saga waiting for shipping must have payment transaction id",
      );
    }

    if (this.status === CheckoutSagaStatus.COMPLETED && !this.shipmentId) {
      throw new DomainError("Completed checkout saga must have shipment id");
    }

    if (this.status === CheckoutSagaStatus.FAILED && !this.failureReason) {
      throw new DomainError("Failed checkout saga must have failure reason");
    }
  }

  markWaitingPayment(): void {
    this.ensureStatus(CheckoutSagaStatus.WAITING_STOCK);
    this.status = CheckoutSagaStatus.WAITING_PAYMENT;
    this.touch();
  }

  markWaitingShipping(paymentTransactionId: string): void {
    this.ensureStatus(CheckoutSagaStatus.WAITING_PAYMENT);

    if (!paymentTransactionId.trim()) {
      throw new DomainError("paymentTransactionId is required");
    }

    this.paymentTransactionId = paymentTransactionId;
    this.status = CheckoutSagaStatus.WAITING_SHIPPING;
    this.touch();
  }

  markCompleted(shipmentId: string): void {
    this.ensureStatus(CheckoutSagaStatus.WAITING_SHIPPING);

    if (!shipmentId.trim()) {
      throw new DomainError("shipmentId is required");
    }

    this.shipmentId = shipmentId;
    this.status = CheckoutSagaStatus.COMPLETED;
    this.touch();
  }

  markFailed(reason: string): void {
    if (
      this.status === CheckoutSagaStatus.COMPLETED ||
      this.status === CheckoutSagaStatus.FAILED
    ) {
      throw new DomainError("Checkout saga is already finished");
    }

    this.failureReason = reason || "Unknown failure";
    this.status = CheckoutSagaStatus.FAILED;
    this.touch();
  }

  canReleaseStock(): boolean {
    return (
      this.status === CheckoutSagaStatus.WAITING_PAYMENT ||
      this.status === CheckoutSagaStatus.WAITING_SHIPPING
    );
  }

  canRefundPayment(): boolean {
    return (
      this.status === CheckoutSagaStatus.WAITING_SHIPPING &&
      Boolean(this.paymentTransactionId)
    );
  }

  getPaymentTransactionId(): string {
    if (!this.paymentTransactionId) {
      throw new DomainError("Payment transaction id is missing");
    }

    return this.paymentTransactionId;
  }

  private ensureStatus(expected: CheckoutSagaStatus): void {
    if (this.status !== expected) {
      throw new DomainError(
        `Checkout saga must be ${expected}, current status is ${this.status}`,
      );
    }
  }

  private touch(): void {
    this.updatedAt = new Date().toISOString();
  }

  toPrimitives(): CheckoutSagaPrimitives {
    return {
      id: this.id,
      orderId: this.orderId,
      status: this.status,
      paymentTransactionId: this.paymentTransactionId,
      shipmentId: this.shipmentId,
      failureReason: this.failureReason,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
