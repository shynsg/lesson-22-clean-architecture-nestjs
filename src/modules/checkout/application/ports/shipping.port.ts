export const SHIPPING_PORT = Symbol("SHIPPING_PORT");

export type CreateShipmentInput = {
  orderId: string;
};

export type CreateShipmentOutput = {
  shipmentId: string;
};

export interface ShippingPort {
  createShipment(input: CreateShipmentInput): Promise<CreateShipmentOutput>;
}
