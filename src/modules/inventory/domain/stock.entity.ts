import { randomUUID } from "crypto";
import { DomainError } from "../../../shared/domain/errors";

export type StockPrimitives = {
  id: string;
  productId: string;
  onHandQuantity: number;
  reservedQuantity: number;
  createdAt: string;
};

export class Stock {
  private constructor(
    private readonly id: string,
    private readonly productId: string,
    private onHandQuantity: number,
    private reservedQuantity: number,
    private readonly createdAt: string,
  ) {}

  static create(input: {
    productId: string;
    onHandQuantity: number;
  }): Stock {
    const productId = String(input.productId || "").trim();

    if (!productId) {
      throw new DomainError("productId is required");
    }

    if (
      !Number.isInteger(input.onHandQuantity) ||
      input.onHandQuantity < 0
    ) {
      throw new DomainError("Stock quantity must be a non-negative integer");
    }

    return new Stock(
      randomUUID(),
      productId,
      input.onHandQuantity,
      0,
      new Date().toISOString(),
    );
  }

  static fromPrimitives(input: StockPrimitives): Stock {
    if (input.reservedQuantity > input.onHandQuantity) {
      throw new DomainError("Reserved stock cannot exceed on-hand stock");
    }

    return new Stock(
      input.id,
      input.productId,
      input.onHandQuantity,
      input.reservedQuantity,
      input.createdAt,
    );
  }

  reserve(quantity: number): void {
    this.ensurePositiveQuantity(quantity);

    if (quantity > this.availableQuantity()) {
      throw new DomainError("Not enough stock available");
    }

    this.reservedQuantity += quantity;
  }

  release(quantity: number): void {
    this.ensurePositiveQuantity(quantity);

    if (quantity > this.reservedQuantity) {
      throw new DomainError("Cannot release more stock than reserved");
    }

    this.reservedQuantity -= quantity;
  }

  availableQuantity(): number {
    return this.onHandQuantity - this.reservedQuantity;
  }

  private ensurePositiveQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new DomainError("Quantity must be a positive integer");
    }
  }

  toPrimitives(): StockPrimitives {
    return {
      id: this.id,
      productId: this.productId,
      onHandQuantity: this.onHandQuantity,
      reservedQuantity: this.reservedQuantity,
      createdAt: this.createdAt,
    };
  }
}
