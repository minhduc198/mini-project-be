import { z } from "zod";

export const getOrdersSchema = z.object({
  pagination: z
    .object({
      page: z.number().optional(),
      perPage: z.number().optional(),
    })
    .optional(),

  sort: z
    .object({
      field: z.string(),
      order: z.enum(["ASC", "DESC"]),
    })
    .optional(),

  filter: z
    .object({
      status: z.string().optional(),
      customer_id: z.number().optional(),

      reference: z.string().optional(),
      date_from: z.string().optional(),
      date_to: z.string().optional(),
    })
    .optional(),
});
