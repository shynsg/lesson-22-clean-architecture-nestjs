import { Inject, Injectable, Logger } from "@nestjs/common";
import { randomUUID } from "crypto";
import { CheckoutRequest } from "../../domain/checkout-request.value-object";
import { CheckoutSaga } from "../../domain/checkout-saga.entity";
import {
  CHECKOUT_SAGA_REPOSITORY,
  CheckoutSagaRepository,
} from "../ports/checkout-saga.repository";
import {
  INVENTORY_PORT,
  InventoryPort,
} from "../ports/inventory.port";
import {
  PAYMENT_PORT,
  PaymentPort,
} from "../ports/payment.port";
import {
  SHIPPING_PORT,
  ShippingPort,
} from "../ports/shipping.port";

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutInput = {
  items: CheckoutItemInput[];
  amount: number;
  simulatePaymentFail?: boolean;
  simulateShippingFail?: boolean;
};

export type CheckoutOutput = {
  orderId: string;
  saga: ReturnType<CheckoutSaga["toPrimitives"]>;
};

@Injectable()
export class CheckoutProcessManager {
  private readonly logger = new Logger(CheckoutProcessManager.name);

  constructor(
    @Inject(INVENTORY_PORT)
    private readonly inventory: InventoryPort,
    @Inject(PAYMENT_PORT)
    private readonly payment: PaymentPort,
    @Inject(SHIPPING_PORT)
    private readonly shipping: ShippingPort,
    @Inject(CHECKOUT_SAGA_REPOSITORY)
    private readonly sagaRepository: CheckoutSagaRepository,
  ) {}

  async execute(input: CheckoutInput): Promise<CheckoutOutput> {
    const checkoutRequest = CheckoutRequest.create(input);

    // Step 1: Start the checkout process and persist the initial saga state.
    const orderId = this.createOrderId(input);
    const saga = CheckoutSaga.start({ orderId });

    await this.sagaRepository.save(saga);
    this.logger.log(
      `Checkout started orderId=${orderId} status=${saga.toPrimitives().status}`,
    );

    try {
      // Step 2: Reserve stock. If this fails, nothing needs compensation yet.
      this.logger.log(`Reserving stock orderId=${orderId}`);
      await this.inventory.reserve({
        orderId,
        items: checkoutRequest.items(),
      });

      // Step 3: Stock is reserved, so payment is the next required step.
      saga.markWaitingPayment();
      await this.sagaRepository.save(saga);
      this.logger.log(
        `Stock reserved orderId=${orderId} status=${saga.toPrimitives().status}`,
      );

      // Step 4: Charge payment. If this fails, reserved stock must be released.
      this.logger.log(`Charging payment orderId=${orderId}`);
      const payment = await this.payment.charge({
        orderId,
        amount: checkoutRequest.amount(),
      });

      // Step 5: Payment succeeded, so shipping is the next required step.
      saga.markWaitingShipping(payment.transactionId);
      await this.sagaRepository.save(saga);
      this.logger.log(
        `Payment charged orderId=${orderId} transactionId=${payment.transactionId} status=${saga.toPrimitives().status}`,
      );

      // Step 6: Create shipment. If this fails, payment and stock are compensated.
      this.logger.log(`Creating shipment orderId=${orderId}`);
      const shipment = await this.shipping.createShipment({
        orderId,
      });

      // Step 7: All external steps succeeded; mark the saga completed.
      saga.markCompleted(shipment.shipmentId);
      await this.sagaRepository.save(saga);
      this.logger.log(
        `Checkout completed orderId=${orderId} shipmentId=${shipment.shipmentId} status=${saga.toPrimitives().status}`,
      );

      return {
        orderId,
        saga: saga.toPrimitives(),
      };
    } catch (error) {
      this.logger.warn(
        `Checkout failed orderId=${orderId} reason=${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
      await this.compensate(saga, error);

      return {
        orderId,
        saga: saga.toPrimitives(),
      };
    }
  }

  private async compensate(
    saga: CheckoutSaga,
    error: unknown,
  ): Promise<void> {
    const orderId = saga.toPrimitives().orderId;

    // If payment was charged, undo it before releasing stock.
    if (saga.canRefundPayment()) {
      this.logger.warn(`Refunding payment orderId=${orderId}`);
      await this.payment.refund({
        orderId,
        transactionId: saga.getPaymentTransactionId(),
      });
    }

    // If stock was reserved, release the reservation.
    if (saga.canReleaseStock()) {
      this.logger.warn(`Releasing stock orderId=${orderId}`);
      await this.inventory.release({
        orderId,
      });
    }

    // Persist the terminal failed state so the process is inspectable/retryable.
    saga.markFailed(error instanceof Error ? error.message : "Checkout failed");

    await this.sagaRepository.save(saga);
    this.logger.warn(
      `Checkout marked failed orderId=${orderId} status=${saga.toPrimitives().status}`,
    );
  }

  private createOrderId(input: CheckoutInput): string {
    if (input.simulatePaymentFail) {
      return `fail-payment-${randomUUID()}`;
    }

    if (input.simulateShippingFail) {
      return `fail-shipping-${randomUUID()}`;
    }

    return `order_${randomUUID()}`;
  }
}
   
