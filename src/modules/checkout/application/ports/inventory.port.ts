export const INVENTORY_PORT = Symbol("INVENTORY_PORT");

export type ReserveStockItem = {
  productId: string;
  quantity: number;
};

export type ReserveStockInput = {
  orderId: string;
  items: ReserveStockItem[];
};

export type ReleaseStockInput = {
  orderId: string;
};

export interface InventoryPort {
  reserve(input: ReserveStockInput): Promise<void>;
  release(input: ReleaseStockInput): Promise<void>;
}
