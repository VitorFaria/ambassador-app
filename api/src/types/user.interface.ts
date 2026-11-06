import { Request } from "express";
import { User } from "../entities/user.entity";
import { Role } from "../enums/role.enum";

export interface IAuthenticatedUser {
  id: number;
  scope: Role.ADMIN | Role.AMBASSADOR;
}

export interface IAuthenticatedRequest extends Request {
  user?: User | null;
}