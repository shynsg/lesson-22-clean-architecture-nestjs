import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { IdempotencyModule } from "../../shared/idempotency/idempotency.module";
import { MessagingModule } from "../../shared/messaging/messaging.module";
import { CANCEL_ORDER_TRANSACTION } from "./application/ports/cancel-order-transaction.port";
import { CREATE_ORDER_TRANSACTION } from "./application/ports/create-order-transaction.port";
import { ORDER_REPOSITORY } from "./application/ports/order-repository.port";
import { ORDER_SUMMARY_READER } from "./application/ports/order-summary-reader.port";
import { PAY_ORDER_TRANSACTION } from "./application/ports/pay-order-transaction.port";
import { PRODUCT_CATALOG } from "./application/ports/product-catalog.port";
import { OrderRbacPolicy } from "./application/policies/order-rbac.policy";
import { CancelOrderUseCase } from "./application/use-cases/cancel-order.use-case";
import { CreateOrderUseCase } from "./application/use-cases/create-order.use-case";
import { GetOrderSummaryUseCase } from "./application/use-cases/get-order-summary.use-case";
import { GetOrderUseCase } from "./application/use-cases/get-order.use-case";
import { ListOrdersUseCase } from "./application/use-cases/list-orders.use-case";
import { PayOrderUseCase } from "./application/use-cases/pay-order.use-case";
import { ProductCatalogAdapter } from "./infrastructure/external/product-catalog/product-catalog.adapter";
import { ProductServiceClient } from "./infrastructure/external/product-catalog/product-service.client";
import { OrderOrmEntity } from "./infrastructure/persistence/order.orm-entity";
import { PostgresOrderSummaryReader } from "./infrastructure/persistence/postgres-order-summary.reader";
import { PostgresOrderRepository } from "./infrastructure/persistence/postgres-order.repository";
import { TypeOrmCancelOrderTransaction } from "./infrastructure/persistence/typeorm-cancel-order.transaction";
import { TypeOrmCreateOrderTransaction } from "./infrastructure/persistence/typeorm-create-order.transaction";
import { TypeOrmPayOrderTransaction } from "./infrastructure/persistence/typeorm-pay-order.transaction";
import { OrdersController } from "./interfaces/http/orders.controller";

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderOrmEntity]),
    MessagingModule,
    IdempotencyModule,
  ],
  controllers: [OrdersController],
  providers: [
    CreateOrderUseCase,
    ListOrdersUseCase,
    GetOrderUseCase,
    PayOrderUseCase,
    CancelOrderUseCase,
    GetOrderSummaryUseCase,
    OrderRbacPolicy,
    ProductServiceClient,
    {
      provide: ORDER_REPOSITORY,
      useClass: PostgresOrderRepository,
    },
    {
      provide: ORDER_SUMMARY_READER,
      useClass: PostgresOrderSummaryReader,
    },
    {
      provide: CREATE_ORDER_TRANSACTION,
      useClass: TypeOrmCreateOrderTransaction,
    },
    {
      provide: PAY_ORDER_TRANSACTION,
      useClass: TypeOrmPayOrderTransaction,
    },
    {
      provide: CANCEL_ORDER_TRANSACTION,
      useClass: TypeOrmCancelOrderTransaction,
    },
    {
      provide: PRODUCT_CATALOG,
      useClass: ProductCatalogAdapter,
    },
  ],
})
export class OrdersModule {}
