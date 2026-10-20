import { faker } from "@faker-js/faker";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import bcrypt from "bcryptjs";

AppDataSource.initialize().then(async () => {
  console.log("seeders ambassadors...");

  const repository = AppDataSource.getRepository(User);
  const default_password = "12345678";

  const password = await bcrypt.hash(default_password, 10);
  const is_ambassador = true;

  for (let i = 0; i < 30; i++) {
    await repository.save({
      first_name: faker.person.firstName(),
      last_name: faker.person.lastName(),
      email: faker.internet.email(),
      password,
      is_ambassador
    });
  }

  console.log("seeding process has completed.");
  process.exit();
});