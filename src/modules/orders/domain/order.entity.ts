import { randomUUID } from "crypto";
import { DomainEvent } from "../../../shared/domain/domain-event";
import { DomainError } from "../../../shared/domain/errors";
import { DiscountPolicy } from "./discount.policy";
import { OrderCreatedDomainEvent } from "./events/order-created.domain-event";
import { OrderPaidDomainEvent } from "./events/order-paid.domain-event";
import { Money } from "./money.value-object";
import {
  OrderItem,
  OrderItemInput,
  OrderItemPrimitives,
} from "./order-item.value-object";
import { OrderCancelledDomainEvent } from "./events/order-cancelled.domain-event";

export enum OrderStatus {
  CREATED = "CREATED",
  PAID = "PAID",
  CANCELED = "CANCELED",
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  PAYMENT_FAILED = "PAYMENT_FAILED",
  SHIPPING_FAILED = "SHIPPING_FAILED",
}

export type OrderPrimitives = {
  id: string;
  customerId: string;
  items: OrderItemPrimitives[];
  totalAmount: number;
  subtotalAmount: number;
  discountAmount: number;
  status: OrderStatus;
  createdAt: string;
  isVipCustomer: boolean;
};

export class Order {
  private constructor(
    private readonly id: string,
    private readonly customerId: string,
    private readonly items: OrderItem[],
    private status: OrderStatus,
    private readonly createdAt: string,
    private readonly domainEvents: DomainEvent[] = [],
    private readonly isVipCustomer: boolean = false,
  ) {}

  static create(input: { customerId: string; items: OrderItemInput[] }): Order {
    const customerId = String(input.customerId || "").trim();

    if (!customerId) {
      throw new DomainError("customerId is required");
    }

    if (!input.items.length) {
      throw new DomainError("Order must have at least one item");
    }

    const items = input.items.map(OrderItem.create);

    const order = new Order(
      randomUUID(),
      customerId,
      items,
      OrderStatus.CREATED,
      new Date().toISOString(),
    );

    order.record(new OrderCreatedDomainEvent(order.toPrimitives()));

    return order;
  }

  private record(event: DomainEvent): void {
    this.domainEvents.push(event);
  }

  isPending(): boolean {
    return this.status === OrderStatus.PENDING;
  }

  markAsPaid(): void {
    if (this.status !== OrderStatus.CREATED) {
      throw new DomainError("Only created orders can be paid");
    }

    this.status = OrderStatus.PAID;

    this.record(new OrderPaidDomainEvent(this.toPrimitives()));
  }

  confirm(): void {
    if (this.status !== OrderStatus.PENDING) {
      throw new DomainError("Only pending orders can be confirmed");
    }

    this.status = OrderStatus.CONFIRMED;
  }

  markPaymentFailed(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new DomainError(
        "Only confirmed orders can be marked as payment failed",
      );
    }

    this.status = OrderStatus.PAYMENT_FAILED;
  }

  markShippingFailed(): void {
    if (this.status !== OrderStatus.CONFIRMED) {
      throw new DomainError(
        "Only confirmed orders can be marked as shipping failed",
      );
    }

    this.status = OrderStatus.SHIPPING_FAILED;
  }

  static fromPrimitives(input: OrderPrimitives): Order {
    return new Order(
      input.id,
      input.customerId,
      input.items.map(OrderItem.fromPrimitives),
      input.status,
      input.createdAt,
      [],
      input.isVipCustomer,
    );
  }

  pullDomainEvents(): DomainEvent[] {
    const events = [...this.domainEvents];
    this.domainEvents.length = 0;
    return events;
  }

  subtotalAmount(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.lineTotal()),
      Money.zero(),
    );
  }

  cancel(): void {
    const cancellableStatuses = [OrderStatus.CREATED, OrderStatus.PENDING];

    if (!cancellableStatuses.includes(this.status)) {
      throw new DomainError("Only created or pending orders can be canceled");
    }

    this.status = OrderStatus.CANCELED;
    this.record(new OrderCancelledDomainEvent(this.toPrimitives()));
  }

  discountAmount(): Money {
    return DiscountPolicy.calculate({
      subtotal: this.subtotalAmount(),
      isVipCustomer: this.isVipCustomer,
    });
  }

  totalAmount(): Money {
    return this.subtotalAmount().subtract(this.discountAmount());
  }

  toPrimitives(): OrderPrimitives {
    return {
      id: this.id,
      customerId: this.customerId,
      items: this.items.map((item) => item.toPrimitives()),
      subtotalAmount: this.subtotalAmount().toNumber(),
      discountAmount: this.discountAmount().toNumber(),
      totalAmount: this.totalAmount().toNumber(),
      status: this.status,
      createdAt: this.createdAt,
      isVipCustomer: this.isVipCustomer,
    };
  }
}
