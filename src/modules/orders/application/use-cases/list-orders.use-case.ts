import { Inject, Injectable } from "@nestjs/common";
import { ORDER_REPOSITORY, OrderRepository } from "../ports/order-repository.port";

@Injectable()
export class ListOrdersUseCase {
  constructor(
    @Inject(ORDER_REPOSITORY)
    private readonly orders: OrderRepository
  ) {}

  async execute() {
    const orders = await this.orders.findAll();

    return {
      orders: orders ? orders.map(order => order.toPrimitives()) : null
    };
  }
}
