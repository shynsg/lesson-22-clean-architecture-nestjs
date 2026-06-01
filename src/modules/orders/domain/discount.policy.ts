import { Money } from "./money.value-object";

export type DiscountPolicyInput = {
  subtotal: Money;
  isVipCustomer: boolean;
};

export class DiscountPolicy {
  static calculate(input: DiscountPolicyInput): Money {
    // rule:
    // subtotal >= 1_000_000 => 10%
    // vip => thêm 5%
    // max discount = 200_000
    const { subtotal, isVipCustomer } = input;

    return subtotal.multiply(
      Math.min(0.1 + (isVipCustomer ? 0.05 : 0), 200_000 / subtotal.toNumber()),
    );
  }
}
