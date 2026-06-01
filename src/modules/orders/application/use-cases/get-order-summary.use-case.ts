import { Inject, Injectable } from "@nestjs/common";
import {
  ORDER_SUMMARY_READER,
  OrderSummaryReader,
} from "../ports/order-summary-reader.port";

@Injectable()
export class GetOrderSummaryUseCase {
  constructor(
    @Inject(ORDER_SUMMARY_READER)
    private readonly summaryReader: OrderSummaryReader,
  ) {}

  async execute() {
    return this.summaryReader.getSummary();
  }
}
