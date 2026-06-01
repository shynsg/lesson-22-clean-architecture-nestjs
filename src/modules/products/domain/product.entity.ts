import { randomUUID } from "crypto";
import { DomainError } from "../../../shared/domain/errors";

export enum ProductStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export type ProductPrimitives = {
  id: string;
  name: string;
  unitPrice: number;
  status: ProductStatus;
  createdAt: string;
};

export type ProductSnapshot = {
  productId: string;
  productName: string;
  unitPrice: number;
};

export class Product {
  private constructor(
    private readonly id: string,
    private readonly name: string,
    private readonly unitPrice: number,
    private status: ProductStatus,
    private readonly createdAt: string,
  ) {}

  static create(input: { name: string; unitPrice: number }): Product {
    const name = String(input.name || "").trim();

    if (!name) {
      throw new DomainError("Product name is required");
    }

    if (!Number.isFinite(input.unitPrice) || input.unitPrice <= 0) {
      throw new DomainError("Product unit price must be greater than zero");
    }

    return new Product(
      randomUUID(),
      name,
      input.unitPrice,
      ProductStatus.ACTIVE,
      new Date().toISOString(),
    );
  }

  static fromPrimitives(input: ProductPrimitives): Product {
    return new Product(
      input.id,
      input.name,
      input.unitPrice,
      input.status,
      input.createdAt,
    );
  }

  deactivate(): void {
    this.status = ProductStatus.INACTIVE;
  }

  activate(): void {
    this.status = ProductStatus.ACTIVE;
  }

  ensureSellable(): void {
    if (this.status !== ProductStatus.ACTIVE) {
      throw new DomainError("Product is not active");
    }
  }

  toSnapshot(): ProductSnapshot {
    this.ensureSellable();

    return {
      productId: this.id,
      productName: this.name,
      unitPrice: this.unitPrice,
    };
  }

  toPrimitives(): ProductPrimitives {
    return {
      id: this.id,
      name: this.name,
      unitPrice: this.unitPrice,
      status: this.status,
      createdAt: this.createdAt,
    };
  }
}
