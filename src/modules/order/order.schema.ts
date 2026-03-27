import { z } from "zod";

export const createOrderSchema = z.object({
  data: z.object({
    customer_id: z.number(),
    address: z.string().optional(),
    basket: z.array(
      z.object({
        product_id: z.number(),
        quantity: z.number(),
      }),
    ),
  }),
});
