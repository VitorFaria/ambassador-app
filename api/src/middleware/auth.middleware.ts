import { NextFunction, Request, Response } from "express";
import { IAuthenticatedRequest, IAuthenticatedUser } from "../types/user.interface";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user.entity";
import { verify } from "jsonwebtoken";
import { Role } from "../enums/role.enum";

export const AuthMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jwt = req.cookies["jwt"] ?? "";
    const payload = verify(jwt, process.env.JWT_SECRET as string) as IAuthenticatedUser;

    if (!payload) {
      return res.status(401).json({ message: "Unauthenticated" });
    }

    const is_ambassador = req.baseUrl.includes("ambassador");

    const auth_req = req as IAuthenticatedRequest;
    const user = await AppDataSource.getRepository(User).findOneBy({ id: payload.id });

    if ((is_ambassador && payload.scope !== Role.AMBASSADOR) 
      || (!is_ambassador && payload.scope !== Role.ADMIN)) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    auth_req.user = user;

    next();
  } catch (e) {
    return res.status(401).json({ message: "User could not authenticate" });
  }
}