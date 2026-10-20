import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";

export const Ambassadors = async (req: Request, res: Response) => {
  res.send(await AppDataSource.getRepository(User).find({
    where: {is_ambassador: true},
  }))
}