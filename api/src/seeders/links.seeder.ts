import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";
import { Link } from "../entities/link.entity";
import { User } from "../entities/user.entity";

AppDataSource.initialize().then(async () => {
  console.log("seeders links...");

  const linkRepository = AppDataSource.getRepository(Link);
  const userRepository = AppDataSource.getRepository(User);

  const users = await userRepository.find();

  if (users.length === 0) {
    console.error("Error: No users found in the database. Please seed users first!");
    process.exit(1);
  }

  for (let i = 0; i < 30; i++) {
    const randomUser = faker.helpers.arrayElement(users);
    await linkRepository.save({
      code: faker.string.alphanumeric(6),
      user: randomUser,
    });
  }

  console.log("seeding process has completed.");
  process.exit();
});