import { Inject, Injectable } from "@nestjs/common";
import { ConflictError, NotFoundError } from "../../../../shared/domain/errors";
import { OutboxEvent } from "../../../outbox/domain/outbox-event.entity";
import { Order } from "../../domain/order.entity";
import {
  CREATE_ORDER_TRANSACTION,
  CreateOrderTransaction,
} from "../ports/create-order-transaction.port";
import { PRODUCT_CATALOG, ProductCatalog } from "../ports/product-catalog.port";
import { OrderItemInput } from "../../domain/order-item.value-object";
import { createHash } from "crypto";
import {
  IDEMPOTENCY_REPOSITORY,
  IdempotencyRepository,
} from "../../../../shared/idempotency/application/idempotency-repository.port";

export type CreateOrderItemInput = {
  productId: string;
  quantity: number;
};

export type CreateOrderInput = {
  customerId: string;
  items: CreateOrderItemInput[];
  idempotencyKey?: string;
};

export type CreateOrderOutput = {
  order: ReturnType<Order["toPrimitives"]>;
  replayed?: boolean;
};

function hashRequest(input: CreateOrderInput) {
  return createHash("sha256")
    .update(
      JSON.stringify({
        customerId: input.customerId,
        items: input.items,
      }),
    )
    .digest("hex");
}

@Injectable()
export class CreateOrderUseCase {
  constructor(
    @Inject(CREATE_ORDER_TRANSACTION)
    private readonly createOrderTransaction: CreateOrderTransaction,
    @Inject(PRODUCT_CATALOG)
    private readonly productCatalog: ProductCatalog,
    @Inject(IDEMPOTENCY_REPOSITORY)
    private readonly idempotency: IdempotencyRepository,
  ) {}

  async execute(input: CreateOrderInput): Promise<CreateOrderOutput> {
    const requestHash = hashRequest(input);
    const idempotencyKey = input.idempotencyKey
      ? `orders:create:${input.idempotencyKey}`
      : undefined;

    if (idempotencyKey) {
      const existing = await this.idempotency.findByKey<CreateOrderOutput>(
        idempotencyKey,
      );

      if (existing) {
        if (existing.requestHash !== requestHash) {
          throw new ConflictError(
            "Idempotency-Key was already used with a different request body",
          );
        }

        return {
          order: existing.response.order,
          replayed: true,
        };
      }
    }

    const productIds = input.items.map((item) => item.productId);
    const products = await this.productCatalog.getByIds(productIds);

    const productById = new Map(
      products.map((product) => [product.productId, product]),
    );

    const orderItems: OrderItemInput[] = input.items.map((item) => {
      const product = productById.get(item.productId);

      if (!product) {
        throw new NotFoundError("Product", item.productId);
      }

      return {
        productId: product.productId,
        productName: product.productName,
        quantity: item.quantity,
        unitPrice: product.unitPrice,
      };
    });

    const order = Order.create({
      customerId: input.customerId,
      items: orderItems,
    });

    const saved = order.toPrimitives();

    const events = order
      .pullDomainEvents()
      .map((event) => OutboxEvent.fromDomainEvent(event));

    await this.createOrderTransaction.save(order, events);

    if (idempotencyKey) {
      await this.idempotency.save({
        key: idempotencyKey,
        requestHash,
        response: { order: saved },
        createdAt: new Date().toISOString(),
      });
    }

    return {
      order: saved,
      replayed: false,
    };
  }
}
