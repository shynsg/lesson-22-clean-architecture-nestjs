import { Injectable } from "@nestjs/common";
import { CheckoutSagaRepository } from "../application/ports/checkout-saga.repository";
import {
  CheckoutSaga,
  CheckoutSagaPrimitives,
} from "../domain/checkout-saga.entity";

@Injectable()
export class InMemoryCheckoutSagaRepository implements CheckoutSagaRepository {
  private readonly sagas = new Map<string, CheckoutSagaPrimitives>();

  async save(saga: CheckoutSaga): Promise<void> {
    const primitives = saga.toPrimitives();
    this.sagas.set(primitives.orderId, primitives);
  }

  async findByOrderId(orderId: string): Promise<CheckoutSaga | null> {
    const saga = this.sagas.get(orderId);

    return saga ? CheckoutSaga.fromPrimitives(saga) : null;
  }
}
