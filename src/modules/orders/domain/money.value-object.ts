import { DomainError } from "../../../shared/domain/errors";

export class Money {
  private constructor(private readonly amount: number) {}

  static create(amount: number): Money {
    if (!Number.isFinite(amount)) {
      throw new DomainError("Money amount must be a valid number");
    }

    if (amount <= 0) {
      throw new DomainError("Money amount must be greater than zero");
    }

    return new Money(amount);
  }

  static zero(): Money {
    return new Money(0);
  }

  add(other: Money): Money {
    return new Money(this.amount + other.amount);
  }

  multiply(quantity: number): Money {
    return new Money(this.amount * quantity);
  }

  subtract(other: Money): Money {
    return new Money(this.amount - other.amount);
  }

  toNumber(): number {
    return this.amount;
  }
}
