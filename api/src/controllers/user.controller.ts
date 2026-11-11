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
  const result = await redisClient.zRangeWithScores("rankings", 0, -1, {
    REV: true,
  });

  const rankings = result.reduce<Record<string, number>>(
    (object, { value, score }) => {
      object[value] = score;
      return object;
    },
    {},
  );

  res.send(rankings);
}