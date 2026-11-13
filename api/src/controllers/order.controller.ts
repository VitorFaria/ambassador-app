import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { Link } from "../entities/link.entity";
import { Product } from "../entities/product.entity";
import { OrderItem } from "../entities/order-item.entity";
import { IProductInput } from "../types/product.interface";
import { ICheckoutItems } from "../types/checkout.interface";
import { stripeService } from "../services/stripe.service";
import { ModePayment, PaymentMethodType } from "../enums/checkout-payment.enum";

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
    const { source } = await AppDataSource.transaction(async (manager) => {
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

      const checkoutItems: ICheckoutItems[] = [];
      for (const p of body.products as IProductInput[]) {
        const product = await manager.getRepository(Product).findOneBy({ id: p.product_id });

        if (!product) throw new InvalidProductError();

        const orderItem = new OrderItem();
        orderItem.order = savedOrder;
        orderItem.product_title = product.title;
        orderItem.price = product.price;
        orderItem.quantity = p.quantity;
        orderItem.ambassador_revenue = 0.1 * Number(product.price) * p.quantity;
        orderItem.admin_revenue = 0.9 * Number(product.price) * p.quantity;

        checkoutItems.push({
          price_data: {
            currency: "brl",
            unit_amount: Math.round(Number(product.price) * 100),
            product_data: {
              name: product.title,
              description: product.description,
              images: [product.image]
            }
          },
          quantity: p.quantity
        });

        await manager.getRepository(OrderItem).save(orderItem);
      }

      const source = await stripeService.createCheckoutSession({
        mode: ModePayment.PAYMENT,
        allowed_payment_method_types: [PaymentMethodType.CARD],
        line_items: checkoutItems,
        success_url: `${process.env.CHECKOUT_URL}/success?source={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.CHECKOUT_URL}/error`
      });
      
      savedOrder.transaction_id = source.id;
      await manager.getRepository(Order).save(savedOrder);

      return { source };
    });

    return res.send(source);
  } catch (error) {
    if (error instanceof InvalidProductError) {
      return res.status(400).send({ message: "Invalid product" });
    }

    throw error;
  }
}
