import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { ProductsBackend, ProductsFrontend } from "./controllers/product.controller";
import {  CreateLink, LinkStats } from "./controllers/link.controller";
import { Rankings } from "./controllers/user.controller";

export const ambassadorRoutes = (router: Router) => {
  router.post("/register", Register);
  router.post("/login", Login);
  router.get("/user", AuthMiddleware, AuthenticatedUser);
  router.post("/logout", AuthMiddleware, Logout);
  router.put("/user/info", AuthMiddleware, UpdateInfo);
  router.put("/user/password", AuthMiddleware, UpdatePassword);

  router.get("/products/frontend", ProductsFrontend);
  router.get("/products/backend", ProductsBackend);

  router.post("/links", AuthMiddleware, CreateLink);
  router.get("/stats", AuthMiddleware, LinkStats);
  router.get("/rankings", AuthMiddleware, Rankings);
}