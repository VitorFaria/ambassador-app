import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255 })
  title: string;

  @Column({ type: "varchar", length: 255 })
  description: string;

  @Column({ type: "varchar", length: 255 })
  image_url: string;

  @Column({ type: "varchar", length: 255 })
  image_key: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price: number;
}