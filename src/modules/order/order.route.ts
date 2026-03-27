import { Router } from "express";
import * as Controller from "./order.controller";

const router = Router();

router.post("/list", Controller.getOrders);
router.get("/:id", Controller.getOrderDetail);
router.post("/", Controller.createOrder);
router.put("/", Controller.updateOrder);
router.delete("/", Controller.deleteOrders);

export default router;
