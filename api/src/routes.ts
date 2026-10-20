import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { Ambassadors } from "./controllers/user.controller";

export const routes = (router: Router) => {
  router.post("/register", Register);
  router.post("/login", Login);
  router.get("/user", AuthMiddleware, AuthenticatedUser);
  router.post("/logout", AuthMiddleware, Logout);
  router.put("/user/info", AuthMiddleware, UpdateInfo);
  router.put("/user/password", AuthMiddleware, UpdatePassword);

  router.get("/ambassadors", AuthMiddleware, Ambassadors);
}
