import { Injectable } from "@nestjs/common";
import {
  ProductCatalog,
  ProductSnapshot,
} from "../../../application/ports/product-catalog.port";
import { ProductCatalogMapper } from "./product-catalog.mapper";
import { ProductServiceClient } from "./product-service.client";

@Injectable()
export class ProductCatalogAdapter implements ProductCatalog {
  constructor(private readonly client: ProductServiceClient) {}

  async getByIds(productIds: string[]): Promise<ProductSnapshot[]> {
    const products = await this.client.getProducts(productIds);

    return products.map((product) => ProductCatalogMapper.toSnapshot(product));
  }
}
