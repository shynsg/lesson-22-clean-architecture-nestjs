export const ORDER_SUMMARY_READER = Symbol("ORDER_SUMMARY_READER");

export type OrderSummary = {
  totalOrders: number;
  createdOrders: number;
  paidOrders: number;
  totalRevenue: number;
};

export interface OrderSummaryReader {
  getSummary(): Promise<OrderSummary>;
}
