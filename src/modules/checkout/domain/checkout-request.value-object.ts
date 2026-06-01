import { DomainError } from "../../../shared/domain/errors";

export type CheckoutRequestItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutRequestInput = {
  items: CheckoutRequestItemInput[];
  amount: number;
};

export type CheckoutRequestItem = {
  productId: string;
  quantity: number;
};

export class CheckoutRequest {
  private constructor(
    private readonly checkoutItems: CheckoutRequestItem[],
    private readonly checkoutAmount: number,
  ) {}

  static create(input: CheckoutRequestInput): CheckoutRequest {
    if (!input.items.length) {
      throw new DomainError("Checkout must have at least one item");
    }

    const items = input.items.map((item) => {
      const productId = String(item.productId || "").trim();

      if (!productId) {
        throw new DomainError("productId is required");
      }

      if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
        throw new DomainError("Item quantity must be a positive integer");
      }

      return {
        productId,
        quantity: item.quantity,
      };
    });

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new DomainError("Checkout amount must be greater than zero");
    }

    return new CheckoutRequest(items, input.amount);
  }

  items(): CheckoutRequestItem[] {
    return [...this.checkoutItems];
  }

  amount(): number {
    return this.checkoutAmount;
  }
}
