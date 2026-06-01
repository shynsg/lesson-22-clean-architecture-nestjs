import { Injectable } from "@nestjs/common";
import { ProductServiceProduct } from "./product-service.types";

@Injectable()
export class ProductServiceClient {
  private readonly products = new Map<string, ProductServiceProduct>([
    [
      "prod_1",
      {
        sku: "prod_1",
        title: "Keyboard",
        pricing: {
          amount: 500000,
          currency: "VND",
          tax_included: true,
        },
        status: "ACTIVE",
        inventory: {
          available: 12,
        },
      },
    ],
    [
      "prod_2",
      {
        sku: "prod_2",
        title: "Mouse",
        pricing: {
          amount: 300000,
          currency: "VND",
          tax_included: true,
        },
        status: "ACTIVE",
        inventory: {
          available: 8,
        },
      },
    ],
    [
      "prod_inactive",
      {
        sku: "prod_inactive",
        title: "Old Monitor",
        pricing: {
          amount: 2000000,
          currency: "VND",
          tax_included: true,
        },
        status: "INACTIVE",
        inventory: {
          available: 3,
        },
      },
    ],
  ]);

  async getProducts(productIds: string[]): Promise<ProductServiceProduct[]> {
    return productIds
      .map((id) => this.products.get(id))
      .filter((product): product is ProductServiceProduct => Boolean(product));
  }
}
