import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { redisClient } from "..";

export const Ambassadors = async (req: Request, res: Response) => {
  res.send(await AppDataSource.getRepository(User).find({
    where: {is_ambassador: true},
  }))
}

export const Rankings = async (req: Request, res: Response) => {
  const result = await redisClient.sendCommand([
    "ZREVRANGEBYSCORE", "rankings", "+inf", "-inf", "WITHSCORES"
  ]);

  res.send(result);
}