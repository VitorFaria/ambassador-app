import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";
import { Order } from "../entities/order.entity";
import { OrderItem } from "../entities/order-item.entity";
import { randomInt } from "crypto";

AppDataSource.initialize().then(async () => {
  console.log("seeders orders...");

  const orderRepository = AppDataSource.getRepository(Order);
  const orderItemRepository = AppDataSource.getRepository(OrderItem);

  for (let i = 0; i < 30; i++) {
    const order = await orderRepository.save({
      user_id: randomInt(2, 31),
      code: faker.string.alphanumeric(6),
      ambassador_email: faker.internet.email(),
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      complete: true,
    });

    for (let j = 0; j < randomInt(1, 5); j++) {
      await orderItemRepository.save({
        order,
        product_title: faker.commerce.productName(),
        price: parseFloat(faker.commerce.price()),
        quantity: randomInt(1, 5),
        ambassador_revenue: randomInt(10, 100),
        admin_revenue: randomInt(10, 100),
      })
    }
  }

  console.log("seeding process has completed.");
  process.exit();
});