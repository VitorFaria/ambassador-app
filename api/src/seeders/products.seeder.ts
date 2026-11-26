import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";
import { Product } from "../entities/product.entity";
import { randomInt } from "crypto";

AppDataSource.initialize().then(async () => {
  console.log("seeders products...");

  const repository = AppDataSource.getRepository(Product);

  for (let i = 0; i < 30; i++) {
    await repository.save({
      title: faker.lorem.words(2),
      description: faker.lorem.words(10),
      image_url: faker.image.url({ width: 200, height: 200}),
      image_key: `products/${faker.string.uuid()}.jpg`,
      price: randomInt(10,100),
    });
  }

  console.log("seeding process has completed.");
  process.exit();
});