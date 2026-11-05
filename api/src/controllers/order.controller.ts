import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";

export const Orders = async (req: Request, res: Response) => {
  const orders = await AppDataSource.getRepository(Order).find({
    where: { complete: true},
    relations: { order_items: true }
  });

  res.send(orders.map((order: Order) => ({
    id: order.id,
    name: order.fullName,
    email: order.email,
    total: order.total,
    created_at: order.created_at,
    order_items: order.order_items
  })));
}