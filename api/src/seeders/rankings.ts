import { createClient } from "redis";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { User } from "../entities/user.entity";
import * as dotenv from "dotenv";

dotenv.config();
AppDataSource.initialize().then(async () => {
  console.log("Updating rankings on redis...");
  const client = createClient({
    url: process.env.REDIS_URL
  })

  await client.connect();

  const ambassadors = await AppDataSource.getRepository(User).find({
    where: {is_ambassador: true},
  });
  
  const orderRepository = AppDataSource.getRepository(Order);

  for (let i = 0; i < ambassadors.length; i++) {
    const orders = await orderRepository.find({
      where: {
        user_id: ambassadors[i].id,
        complete: true
      },
      relations: {
        order_items: true
      }
    });

    const revenue = orders.reduce((sum, order) => sum + order.ambassadorRevenue, 0);

    await client.zAdd("rankings", {
      value: ambassadors[i].fullName,
      score: revenue
    });
  }

  console.log("Rankings updated successfully.");
  process.exit();
})