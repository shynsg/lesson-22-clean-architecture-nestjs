import { randomUUID } from "crypto";
import {
  CreateShipmentInput,
  CreateShipmentOutput,
  ShippingPort,
} from "../application/ports/shipping.port";
import { Injectable, Logger } from "@nestjs/common";

@Injectable()
export class FakeShippingAdapter implements ShippingPort {
  private readonly logger = new Logger(FakeShippingAdapter.name);
  private readonly shipments = new Map<string, string>();

  async createShipment(
    input: CreateShipmentInput,
  ): Promise<CreateShipmentOutput> {
    this.logger.log(`create shipment orderId=${input.orderId}`);
    if (input.orderId.includes("fail-shipping")) {
      this.logger.warn(`create shipment failed orderId=${input.orderId}`);
      throw new Error("Shipping creation failed");
    }

    const shipmentId = `ship_${randomUUID()}`;
    this.shipments.set(input.orderId, shipmentId);
    this.logger.log(
      `create shipment succeeded orderId=${input.orderId} shipmentId=${shipmentId}`,
    );

    return {
      shipmentId,
    };
  }

  hasShipment(orderId: string): boolean {
    return this.shipments.has(orderId);
  }
}
