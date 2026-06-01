import { Injectable, Logger } from "@nestjs/common";
import {
  InventoryPort,
  ReleaseStockInput,
  ReserveStockInput,
} from "../application/ports/inventory.port";

@Injectable()
export class FakeInventoryAdapter implements InventoryPort {
  private readonly logger = new Logger(FakeInventoryAdapter.name);
  private readonly reservations = new Map<string, ReserveStockInput>();

  async reserve(input: ReserveStockInput): Promise<void> {
    this.logger.log(`reserve orderId=${input.orderId}`);
    const shouldFail = input.items.some(
      (item) => item.productId === "fail-stock",
    );

    if (shouldFail) {
      this.logger.warn(`reserve failed orderId=${input.orderId}`);
      throw new Error("Stock reservation failed");
    }

    this.reservations.set(input.orderId, input);
    this.logger.log(`reserve succeeded orderId=${input.orderId}`);
  }

  async release(input: ReleaseStockInput): Promise<void> {
    this.reservations.delete(input.orderId);
    this.logger.warn(`release orderId=${input.orderId}`);
  }

  hasReservation(orderId: string): boolean {
    return this.reservations.has(orderId);
  }
}
