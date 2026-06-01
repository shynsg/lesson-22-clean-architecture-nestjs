export const PAYMENT_PORT = Symbol("PAYMENT_PORT");

export type ChargePaymentInput = {
  orderId: string;
  amount: number;
};

export type ChargePaymentOutput = {
  transactionId: string;
};

export type RefundPaymentInput = {
  orderId: string;
  transactionId: string;
};

export interface PaymentPort {
  charge(input: ChargePaymentInput): Promise<ChargePaymentOutput>;
  refund(input: RefundPaymentInput): Promise<void>;
}
