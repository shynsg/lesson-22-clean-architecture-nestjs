import { Body, Controller, Get, Param, Post, Headers } from "@nestjs/common";
import { Actor, ActorRole } from "../../../../shared/application/actor";
import { CancelOrderUseCase } from "../../application/use-cases/cancel-order.use-case";
import { CreateOrderUseCase } from "../../application/use-cases/create-order.use-case";
import { GetOrderSummaryUseCase } from "../../application/use-cases/get-order-summary.use-case";
import { GetOrderUseCase } from "../../application/use-cases/get-order.use-case";
import { ListOrdersUseCase } from "../../application/use-cases/list-orders.use-case";
import { PayOrderUseCase } from "../../application/use-cases/pay-order.use-case";
import { CreateOrderDto } from "./dto/create-order.dto";
import { OrderPresenter } from "./order.presenter";

@Controller("orders")
export class OrdersController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly getOrderUseCase: GetOrderUseCase,
    private readonly payOrderUseCase: PayOrderUseCase,
    private readonly cancelOrderUseCase: CancelOrderUseCase,
    private readonly getOrderSummaryUseCase: GetOrderSummaryUseCase,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateOrderDto,
    @Headers("idempotency-key") idempotencyKey?: string,
  ) {
    const result = await this.createOrderUseCase.execute({
      ...dto,
      idempotencyKey,
    });

    return {
      order: OrderPresenter.toHttp(result.order),
      replayed: result.replayed,
    };
  }

  @Get()
  async list() {
    const result = await this.listOrdersUseCase.execute();

    return {
      orders: result.orders ? result.orders.map(OrderPresenter.toHttp) : null,
    };
  }

  @Get("/summary")
  async summary() {
    return await this.getOrderSummaryUseCase.execute();
  }

  @Get(":id")
  async getById(@Param("id") id: string) {
    const result = await this.getOrderUseCase.execute(id);

    return {
      order: result.order ? OrderPresenter.toHttp(result.order) : null,
    };
  }

  @Post(":id/pay")
  async payOrder(@Param("id") id: string) {
    const result = await this.payOrderUseCase.execute({ orderId: id });

    return {
      order: result.order ? OrderPresenter.toHttp(result.order) : null,
    };
  }

  @Post(":id/cancel")
  async cancelOrder(
    @Param("id") id: string,
    @Headers("x-user-id") userId?: string,
    @Headers("x-user-role") role?: string,
  ) {
    const result = await this.cancelOrderUseCase.execute({
      orderId: id,
      actor: this.mockActor(userId, role),
    });

    return {
      order: result.order ? OrderPresenter.toHttp(result.order) : null,
    };
  }

  private mockActor(userId?: string, role?: string): Actor {
    const normalizedRole = String(role || ActorRole.USER).toUpperCase();

    const actorRole =
      normalizedRole in ActorRole
        ? (normalizedRole as ActorRole)
        : ActorRole.USER;

    return {
      id: userId || "cus_1",
      role: actorRole,
    };
  }
}
