import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { Link } from "../entities/link.entity";
import { Product } from "../entities/product.entity";
import { OrderItem } from "../entities/order-item.entity";
import { IProductInput } from "../types/product.interface";

class InvalidProductError extends Error {}

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

export const CreateOrder = async (req: Request, res: Response) => {
  const body = req.body;

  const link = await AppDataSource.getRepository(Link).findOne({
    where: { code: body.code },
    relations: { user: true }
  });

  if (!link) {
    return res.status(400).send({
      message: "Invalid code"
    });
  }

  try {
    const order = await AppDataSource.transaction(async (manager) => {
      const newOrder = new Order();
      newOrder.user_id = link.user.id;
      newOrder.ambassador_email = link.user.email;
      newOrder.code = link.code;
      newOrder.first_name = body.first_name;
      newOrder.last_name = body.last_name;
      newOrder.email = body.email;
      newOrder.address = body.address;
      newOrder.country = body.country;
      newOrder.city = body.city;
      newOrder.zip = body.zip;

      const savedOrder = await manager.getRepository(Order).save(newOrder);

      for (const p of body.products as IProductInput[]) {
        const product = await manager.getRepository(Product).findOneBy({ id: p.product_id });

        if (!product) throw new InvalidProductError();

        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.product_title = product.title;
        orderItem.price = product.price;
        orderItem.quantity = p.quantity;
        orderItem.ambassador_revenue = 0.1 * product.price * p.quantity;
        orderItem.admin_revenue = 0.9 * product.price * p.quantity;

        await manager.getRepository(OrderItem).save(orderItem);
      }

      return savedOrder;
    });

    return res.send(order);
  } catch (error) {
    if (error instanceof InvalidProductError) {
      return res.status(400).send({ message: "Invalid product" });
    }

    throw error;
  }
}
