import { DomainError } from "../../../../../shared/domain/errors";
import { ProductSnapshot } from "../../../application/ports/product-catalog.port";
import { ProductServiceProduct } from "./product-service.types";

export class ProductCatalogMapper {
  static toSnapshot(product: ProductServiceProduct): ProductSnapshot {
    if (product.status !== "ACTIVE") {
      throw new DomainError("Product is not active");
    }

    if (product.pricing.currency !== "VND") {
      throw new DomainError("Only VND products are supported");
    }

    if (product.inventory.available <= 0) {
      throw new DomainError("Product is out of stock");
    }

    return {
      productId: product.sku,
      productName: product.title,
      unitPrice: product.pricing.amount,
    };
  }
}
