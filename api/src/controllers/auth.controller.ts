import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";

export const Register = async (req: Request, res: Response) => {
  const body = req.body;
  if (body.password !== body.passwordConfirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const {password, ...user} = await AppDataSource.getRepository(User).save({
    first_name: body.first_name,
    last_name: body.last_name,
    email: body.email,
    password: await bcrypt.hash(body.password, 10),
  });

  res.send(user);
}