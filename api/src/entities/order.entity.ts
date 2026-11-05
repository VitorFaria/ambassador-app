import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { OrderItem } from "./order-item.entity";
import { Link } from "./link.entity";

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, nullable: true })
  transaction_id: string;

  @Column({ type: "int" })
  user_id: number;

  @Column({ type: "varchar", length: 255 })
  code: string;

  @Column({ type: "varchar", length: 255 })
  ambassador_email: string;

  @Column({ type: "varchar", length: 255 })
  first_name: string;

  @Column({ type: "varchar", length: 255 })
  last_name: string;

  @Column({ type: "varchar", length: 255 })
  email: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  address: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  country: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  city: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  zip: string;

  @Column({ type: "boolean", default: false })
  complete: boolean;

  @CreateDateColumn()
  created_at: Date;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  order_items: OrderItem[];

  @ManyToOne(() => Link, link => link.orders,{
    createForeignKeyConstraints: false
  })
  @JoinColumn({ 
    referencedColumnName: 'code',
    name: 'code'
  })
  link: Link;

  get fullName(): string {
    return this.first_name + " " + this.last_name;
  }

  get total(): number {
    return this.order_items.reduce((s: number, i: OrderItem) => s + i.admin_revenue, 0);
  }
}