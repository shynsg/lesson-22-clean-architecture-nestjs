import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import {
  OrderSummary,
  OrderSummaryReader,
} from "../../application/ports/order-summary-reader.port";
import { OrderOrmEntity } from "./order.orm-entity";
import { OrderStatus } from "../../domain/order.entity";

@Injectable()
export class PostgresOrderSummaryReader implements OrderSummaryReader {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repo: Repository<OrderOrmEntity>,
  ) {}

  async getSummary(): Promise<OrderSummary> {
    const result = await this.repo
      .createQueryBuilder("order")
      .select("COUNT(*)", "totalOrders")
      .addSelect(
        `COUNT(*) FILTER (WHERE order.status = :createdStatus)`,
        "createdOrders",
      )
      .addSelect(
        `COUNT(*) FILTER (WHERE order.status = :paidStatus)`,
        "paidOrders",
      )
      .addSelect(
        `SUM(order.total_amount) FILTER (WHERE order.status = :paidStatus)`,
        "totalRevenue",
      )
      .setParameters({
        createdStatus: OrderStatus.CREATED,
        paidStatus: OrderStatus.PAID,
      })
      .getRawOne<{
        totalOrders: string;
        createdOrders: string;
        paidOrders: string;
        totalRevenue: string;
      }>();

    return {
      totalOrders: Number(result?.totalOrders ?? 0),
      createdOrders: Number(result?.createdOrders ?? 0),
      paidOrders: Number(result?.paidOrders ?? 0),
      totalRevenue: Number(result?.totalRevenue ?? 0),
    };
  }
}
