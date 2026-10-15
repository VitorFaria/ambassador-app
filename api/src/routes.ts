import { Router } from "express";
import { Login, Register } from "./controllers/auth.controller";

export const routes = (router: Router) => {
  router.post("/api/admin/register", Register);
  router.post("/api/admin/login", Login);
}