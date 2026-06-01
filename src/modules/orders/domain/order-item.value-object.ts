import { DomainError } from "../../../shared/domain/errors";
import { Money } from "./money.value-object";

export type OrderItemInput = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
};

export type OrderItemPrimitives = {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
};

export class OrderItem {
  private constructor(
    private readonly productId: string,
    private readonly productName: string,
    private readonly quantity: number,
    private readonly unitPrice: Money,
  ) {}

  static create(input: OrderItemInput): OrderItem {
    const productId = String(input.productId || "").trim();
    const productName = String(input.productName || "").trim();

    if (!productId) {
      throw new DomainError("productId is required");
    }

    if (!productName) {
      throw new DomainError("productName is required");
    }

    if (!Number.isInteger(input.quantity) || input.quantity <= 0) {
      throw new DomainError("Item quantity must be a positive integer");
    }

    return new OrderItem(
      productId,
      productName,
      input.quantity,
      Money.create(input.unitPrice),
    );
  }

  static fromPrimitives(input: OrderItemPrimitives): OrderItem {
    return new OrderItem(
      input.productId,
      input.productName,
      input.quantity,
      Money.create(input.unitPrice),
    );
  }

  lineTotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }

  toPrimitives(): OrderItemPrimitives {
    return {
      productId: this.productId,
      productName: this.productName,
      quantity: this.quantity,
      unitPrice: this.unitPrice.toNumber(),
      lineTotal: this.lineTotal().toNumber(),
    };
  }
}
