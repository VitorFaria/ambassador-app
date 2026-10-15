import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";

export const Register = async (req: Request, res: Response) => {
  const body = req.body;
  if (body.password !== body.password_confirmation) {
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

export const Login = async (req: Request, res: Response) => {
  const user = await AppDataSource.getRepository(User)
  .findOneBy({ email: req.body.email });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = sign({id: user.id}, process.env.JWT_SECRET as string);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: parseInt(process.env.COOKIE_MAX_AGE as string),
  });

  res.status(200).json({ message: "success" });
}