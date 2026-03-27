import { Router } from "express";
import * as Controller from "./inventory.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  getInventoryDetailSchema,
  createInventorySchema,
  updateInventorySchema,
  deleteInventorySchema,
} from "./inventory.schema";

const router = Router();

router.get("/", Controller.getInventories);

router.get(
  "/:id",
  validate(getInventoryDetailSchema),
  Controller.getInventoryDetail,
);

router.post("/", validate(createInventorySchema), Controller.createInventory);

router.put("/", validate(updateInventorySchema), Controller.updateInventory);

router.delete(
  "/",
  validate(deleteInventorySchema),
  Controller.deleteInventories,
);

export default router;
