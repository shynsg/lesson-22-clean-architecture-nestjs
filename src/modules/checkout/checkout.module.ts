import { Module } from "@nestjs/common";
import { CheckoutController } from "./interface/http/checkout.controller";
import { CHECKOUT_SAGA_REPOSITORY } from "./application/ports/checkout-saga.repository";
import { INVENTORY_PORT } from "./application/ports/inventory.port";
import { PAYMENT_PORT } from "./application/ports/payment.port";
import { SHIPPING_PORT } from "./application/ports/shipping.port";
import { FakeInventoryAdapter } from "./infrastructure/fake-inventory.adapter";
import { FakePaymentAdapter } from "./infrastructure/fake-payment.adapter";
import { FakeShippingAdapter } from "./infrastructure/fake-shipping.adapter";
import { InMemoryCheckoutSagaRepository } from "./infrastructure/in-memory-checkout-saga.repository";
import { CheckoutProcessManager } from "./application/process-managers/checkout.process-manager";

@Module({
  controllers: [CheckoutController],
  providers: [
    CheckoutProcessManager,
    {
      provide: INVENTORY_PORT,
      useClass: FakeInventoryAdapter,
    },
    {
      provide: PAYMENT_PORT,
      useClass: FakePaymentAdapter,
    },
    {
      provide: SHIPPING_PORT,
      useClass: FakeShippingAdapter,
    },
    {
      provide: CHECKOUT_SAGA_REPOSITORY,
      useClass: InMemoryCheckoutSagaRepository,
    },
  ],
})
export class CheckoutModule {}
