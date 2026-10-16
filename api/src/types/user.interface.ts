import { Request } from "express";
import { User } from "../entities/user.entity";

export interface IAuthenticatedUser {
  id: number;
}

export interface IAuthenticatedRequest extends Request {
  user?: User | null;
}