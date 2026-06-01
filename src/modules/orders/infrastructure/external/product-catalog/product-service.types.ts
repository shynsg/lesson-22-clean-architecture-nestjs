export type ProductServiceProduct = {
  sku: string;
  title: string;
  pricing: {
    amount: number;
    currency: string;
    tax_included: boolean;
  };
  status: "ACTIVE" | "INACTIVE" | "ARCHIVED";
  inventory: {
    available: number;
  };
};
