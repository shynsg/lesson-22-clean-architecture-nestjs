import { Body, Controller, Post } from "@nestjs/common";
import {
  CheckoutInput,
  CheckoutProcessManager,
} from "../../application/process-managers/checkout.process-manager";

@Controller("checkout")
export class CheckoutController {
  constructor(
    private readonly checkoutProcessManager: CheckoutProcessManager,
  ) {}

  @Post()
  async checkout(@Body() body: CheckoutInput) {
    return await this.checkoutProcessManager.execute(body);
  }
}
