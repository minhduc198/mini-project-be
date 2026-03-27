import { Router } from "express";
import * as Controller from "./customer.controller";
import { validate } from "../../middlewares/validate.middleware";
import {
  getCustomersSchema,
  createCustomerSchema,
  updateCustomerSchema,
  deleteCustomersSchema,
  getCustomerDetailSchema,
} from "./customer.schema";

const router = Router();

router.post("/list", validate(getCustomersSchema), Controller.getCustomers);
router.post("/", validate(createCustomerSchema), Controller.createCustomer);
router.put("/", validate(updateCustomerSchema), Controller.updateCustomer);
router.delete("/", validate(deleteCustomersSchema), Controller.deleteCustomers);

router.get(
  "/:id",
  validate(getCustomerDetailSchema),
  Controller.getCustomerDetail,
);

export default router;
