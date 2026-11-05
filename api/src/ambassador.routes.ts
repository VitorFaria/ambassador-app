import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";

export const ambassadorRoutes = (router: Router) => {
  router.post("/register", Register);
  router.post("/login", Login);
  router.get("/user", AuthMiddleware, AuthenticatedUser);
  router.post("/logout", AuthMiddleware, Logout);
  router.put("/user/info", AuthMiddleware, UpdateInfo);
  router.put("/user/password", AuthMiddleware, UpdatePassword);
}