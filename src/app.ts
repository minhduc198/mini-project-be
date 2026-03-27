import express from "express";
import authRoutes from "./modules/auth/auth.route";
import { errorHandler } from "./middlewares/error.middleware";
import customerRoutes from "./modules/customer/customer.route";
import productRoutes from "./modules/product/product.route";
import inventoryRoutes from "./modules/inventory/inventory.route";
import orderRoutes from "./modules/order/order.route";
import cors from "cors";

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/inventories", inventoryRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

export default app;
