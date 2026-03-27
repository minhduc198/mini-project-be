import { Router } from "express";
import * as Controller from "./product.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  getProductsSchema,
  getProductDetailSchema,
  createProductSchema,
  updateProductSchema,
  deleteProductSchema,
} from "./product.schema";

const router = Router();

router.post("/list", validate(getProductsSchema), Controller.getProducts);
router.get(
  "/:id",
  validate(getProductDetailSchema),
  Controller.getProductDetail,
);
router.post("/", validate(createProductSchema), Controller.createProduct);
router.put("/", validate(updateProductSchema), Controller.updateProduct);
router.delete("/", validate(deleteProductSchema), Controller.deleteProducts);

export default router;
