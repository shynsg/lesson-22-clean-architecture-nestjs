export const PRODUCT_CATALOG = Symbol("PRODUCT_CATALOG");

export type ProductSnapshot = {
  productId: string;
  productName: string;
  unitPrice: number;
};

export interface ProductCatalog {
  getByIds(productIds: string[]): Promise<ProductSnapshot[]>;
}
