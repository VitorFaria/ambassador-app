import { Router } from "express";
import { AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword } from "./controllers/auth.controller";
import { AuthMiddleware } from "./middleware/auth.middleware";
import { Ambassadors } from "./controllers/user.controller";
import { CreateProduct, DeleteProduct, GetProduct, Products, UpdateProduct } from "./controllers/product.controller";
import { Links } from "./controllers/link.controller";
import { Orders } from "./controllers/order.controller";

export const adminRoutes = (router: Router) => {
  router.post("/register", Register);
  router.post("/login", Login);
  router.get("/user", AuthMiddleware, AuthenticatedUser);
  router.post("/logout", AuthMiddleware, Logout);
  router.put("/user/info", AuthMiddleware, UpdateInfo);
  router.put("/user/password", AuthMiddleware, UpdatePassword);

  router.get("/ambassadors", AuthMiddleware, Ambassadors);

  router.get("/products", AuthMiddleware, Products);
  router.post("/products", AuthMiddleware, CreateProduct);
  router.get("/products/:id", AuthMiddleware, GetProduct);
  router.put("/products/:id", AuthMiddleware, UpdateProduct);
  router.delete("/products/:id", AuthMiddleware, DeleteProduct);

  router.get("/user/:id/links", AuthMiddleware, Links);

  router.get("/orders", AuthMiddleware, Orders);
}
