import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";
import { sign, verify } from "jsonwebtoken";
import { IAuthenticatedUser } from "../types/user.interface";

export const Register = async (req: Request, res: Response) => {
  const {password, password_confirmation, ...body} = req.body;
  if (password !== password_confirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const user = await AppDataSource.getRepository(User).save({
    ...body,
    password: await bcrypt.hash(password, 10),
  });

  delete user.password;

  res.send(user);
}

export const Login = async (req: Request, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: req.body.email },
    select: {id: true, password: true}
  });

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

export const AuthenticatedUser = async (req: Request, res: Response) => {
  const jwt = req.cookies["jwt"] ?? "";

  if (!jwt) return res.status(401).json({ message: "Unauthenticated" });
  const payload = verify(jwt, process.env.JWT_SECRET as string) as IAuthenticatedUser;

  if (!payload) {
    return res.status(401).json({ message: "Unauthenticated" });
  }

  const user = await AppDataSource.getRepository(User).findOneBy({ id: payload.id });

  res.status(200).json(user);
}

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0});

  res.status(200).json({ message: "success" });
}