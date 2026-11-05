import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Link } from "../entities/link.entity";

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