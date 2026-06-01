import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderStatus } from "../../domain/order.entity";

@Entity("orders")
export class OrderOrmEntity {
  @PrimaryColumn("uuid")
  id!: string;

  @Column({ name: "customer_id", type: "varchar" })
  customerId!: string;

  @Column({ type: "enum", enum: OrderStatus })
  status!: OrderStatus;

  @Column({ name: "total_amount", type: "int", default: 0 })
  totalAmount!: number;

  @Column({ name: "subtotal_amount", type: "int", default: 0 })
  subtotalAmount!: number;

  @Column({ name: "discount_amount", type: "int", default: 0 })
  discountAmount!: number;

  @Column({ type: "jsonb" })
  items!: Array<{
    productName: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;

  @Column({ name: "is_vip_customer", type: "boolean", default: false })
  isVipCustomer!: boolean;

  @CreateDateColumn({ name: "created_at", type: "timestamptz" })
  createdAt!: Date;

  @UpdateDateColumn({ name: "updated_at", type: "timestamptz" })
  updatedAt!: Date;
}
