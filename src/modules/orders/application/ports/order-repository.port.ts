import { Order } from "../../domain/order.entity";

export const ORDER_REPOSITORY = Symbol("ORDER_REPOSITORY");

export interface OrderRepository {
  save(order: Order): Promise<void>;
  findAll(): Promise<Order[] | null>;
  findById(id: string): Promise<Order | null>;
  findByIdForUpdate(id: string): Promise<Order | null>;
}
