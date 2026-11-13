import { Router } from "express";
import { GetLinkByCode } from "./controllers/link.controller";
import { CreateOrder } from "./controllers/order.controller";

export const checkoutRoutes = (router: Router) => {
 router.get("/links/:code", GetLinkByCode);

 router.post("/orders", CreateOrder);
}