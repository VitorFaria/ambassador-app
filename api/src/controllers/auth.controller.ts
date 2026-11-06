import { Request, Response } from "express";
import { User } from "../entities/user.entity";
import { AppDataSource } from "../data-source";
import bcrypt from "bcryptjs";
import { sign } from "jsonwebtoken";
import { IAuthenticatedRequest } from "../types/user.interface";
import { Role } from "../enums/role.enum";
import { Order } from "../entities/order.entity";

export const Register = async (req: Request, res: Response) => {
  const {password, password_confirmation, ...body} = req.body;
  if (password !== password_confirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const is_ambassador = req.baseUrl.includes("ambassador");
  const user = await AppDataSource.getRepository(User).save({
    ...body,
    password: await bcrypt.hash(password, 10),
    is_ambassador
  });

  delete user.password;

  res.send(user);
}

export const Login = async (req: Request, res: Response) => {
  const user = await AppDataSource.getRepository(User).findOne({
    where: { email: req.body.email },
    select: {id: true, password: true, is_ambassador: true}
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  if (!await bcrypt.compare(req.body.password, user.password)) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const is_admin = req.baseUrl.includes("admin");

  if (user.is_ambassador && is_admin) {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const token = sign(
    {
      id: user.id,
      scope: is_admin ? Role.ADMIN : Role.AMBASSADOR
    }, 
    process.env.JWT_SECRET as string);

  res.cookie("jwt", token, {
    httpOnly: true,
    maxAge: parseInt(process.env.COOKIE_MAX_AGE as string),
  });

  res.status(200).json({ message: "success" });
}

export const AuthenticatedUser = async (req: IAuthenticatedRequest, res: Response) => {
  const user = req.user;

  if (req.baseUrl.includes("admin")) {
    return res.status(200).json(user);
  }

  const orders = await AppDataSource.getRepository(Order).find({
    where: {
      id: user?.id,
      complete: true
    },
    relations: {
      order_items: true
    }
  });

  if (user) {
    user.revenue = orders.reduce((s: number, o: Order) => s + o.ambassador_revenue, 0);
  }

  res.send(user);
}

export const Logout = async (req: Request, res: Response) => {
  res.cookie("jwt", "", { maxAge: 0});

  res.status(200).json({ message: "success" });
}

export const UpdateInfo = async (req: IAuthenticatedRequest, res: Response) => {
  const user = req.user;
  console.log(user);
  if (!user) return res.status(400).json({ message: "No data sent" });

  const repository = AppDataSource.getRepository(User);

  if (req.body.email !== undefined) {
    const existingUser = await repository.findOneBy({ email: req.body.email });

    if (existingUser && existingUser.id !== user.id) {
      return res.status(409).json({ message: "Email is already in use" });
    }
  }

  await repository.update(user.id, req.body);

  res.send(await repository.findOneBy({ id: user.id }));
};

export const UpdatePassword = async (req: IAuthenticatedRequest, res: Response) => {
  const user = req.user;
  if (!user) return res.status(400).json({ message: "No data sent" });

  const { current_password, password, password_confirmation } = req.body;
  if (!current_password || !password || !password_confirmation) {
    return res.status(400).json({ message: "Current password and new password are required" });
  }

  if (password !== password_confirmation) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  const repository = AppDataSource.getRepository(User);
  const userWithPassword = await repository.findOne({
    where: { id: user.id },
    select: { id: true, password: true },
  });

  if (!userWithPassword || !await bcrypt.compare(current_password, userWithPassword.password)) {
    return res.status(400).json({ message: "Current password is incorrect" });
  }

  await repository.update(user.id, {
    password: await bcrypt.hash(password, 10),
  });

  return res.status(200).json({ message: "Password updated successfully" });
}
