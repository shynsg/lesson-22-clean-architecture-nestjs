import { CheckoutSaga } from "../../domain/checkout-saga.entity";

export const CHECKOUT_SAGA_REPOSITORY = Symbol("CHECKOUT_SAGA_REPOSITORY");

export interface CheckoutSagaRepository {
  save(saga: CheckoutSaga): Promise<void>;
  findByOrderId(orderId: string): Promise<CheckoutSaga | null>;
}
