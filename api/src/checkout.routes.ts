import { Router } from "express";
import { GetLinkByCode } from "./controllers/link.controller";

export const checkoutRoutes = (router: Router) => {
 router.get("/links/:code", GetLinkByCode);
}