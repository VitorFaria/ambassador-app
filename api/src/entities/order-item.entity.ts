import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Order } from "./order.entity";

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  product_title: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;

  @Column({ type: "int" })
  quantity: number;

  @Column({ type: "int" })
  ambassador_revenue: number;

  @Column({ type: "int" })
  admin_revenue: number;

  @ManyToOne(() => Order, order => order.order_items)
  @JoinColumn({ name: "order_id" })
  order: Order;
}