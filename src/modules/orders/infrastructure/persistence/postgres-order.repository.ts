import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { OrderRepository } from "../../application/ports/order-repository.port";
import { OrderOrmEntity } from "./order.orm-entity";
import { Order } from "../../domain/order.entity";
import { OrderMapper } from "./order.mapper";

export class PostgresOrderRepository implements OrderRepository {
  constructor(
    @InjectRepository(OrderOrmEntity)
    private readonly repo: Repository<OrderOrmEntity>,
  ) {}

  async save(order: Order): Promise<void> {
    const orm = OrderMapper.toOrm(order);
    await this.repo.save(orm);
  }

  async findAll(): Promise<Order[] | null> {
    const orm = await this.repo.find();
    if (!orm || orm.length === 0) return null;
    return orm.map(OrderMapper.toDomain);
  }

  async findById(id: string): Promise<Order | null> {
    const orm = await this.repo.findOne({
      where: {
        id,
      },
    });
    if (!orm) return null;
    return OrderMapper.toDomain(orm);
  }

  async findByIdForUpdate(id: string): Promise<Order | null> {
    const orm = await this.repo.findOne({
      where: { id },
      lock: { mode: "pessimistic_write" },
    });

    if (!orm) return null;

    return OrderMapper.toDomain(orm);
  }
}
