import { NextFunction, Request, Response } from "express";
import { IAuthenticatedRequest, IAuthenticatedUser } from "../types/user.interface";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { verify } from "jsonwebtoken";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwt = req.cookies["jwt"] ?? "";
    const payload = verify(jwt, process.env.JWT_SECRET as string) as IAuthenticatedUser;

    if (!payload) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const authReq = req as IAuthenticatedRequest;

    authReq.user = await AppDataSource.getRepository(User).findOneBy({ id: payload.id });

    next();
  } catch (e) {
    return res.status(401).json({ message: "User could not authenticate" });
  }
}