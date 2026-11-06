import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Link } from "../entities/link.entity";
import { IAuthenticatedRequest } from "../types/user.interface";
import { User } from "../entities/user.entity";

export const Links = async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const links = await AppDataSource.getRepository(Link).find({
    where: {
      user: {
        id
      },
    },
    relations: {
      orders: {
        order_items: true
      }
    }
  });

  res.send(links);
}

export const createLink = async (req: IAuthenticatedRequest, res: Response) => {
  const user = req.user;

  const link = await AppDataSource.getRepository(Link).save({
    user: user as User,
    code: Math.random().toString(36).substring(6),
    products: req.body.products.map((id: number) => ({ id }))
  });

  res.send(link);
}