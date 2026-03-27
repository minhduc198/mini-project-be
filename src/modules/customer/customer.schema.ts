import { z } from "zod";

export const getCustomersSchema = z.object({
  body: z.object({
    pagination: z.object({
      page: z.number(),
      perPage: z.number(),
    }),
    sort: z
      .object({
        field: z.string(),
        order: z.enum(["ASC", "DESC"]),
      })
      .optional(),
    filter: z
      .object({
        id: z.string().optional(),
        q: z.string().optional(),
        groups: z.string().optional(),
        last_seen_gte: z.string().optional(),
        last_seen_lte: z.string().optional(),
        has_newsletter: z.string().optional(),
        nb_orders_gte: z.string().optional(),
      })
      .optional(),
  }),
});

export const createCustomerSchema = z.object({
  body: z.object({
    data: z.object({
      email: z.string().email(),
      first_name: z.string().optional(),
      last_name: z.string().optional(),
    }),
  }),
});

export const updateCustomerSchema = z.object({
  body: z.object({
    id: z.number(),
    data: z.object({}).passthrough(),
  }),
});

export const deleteCustomersSchema = z.object({
  body: z.object({
    ids: z.array(z.number()),
  }),
});

export const getCustomerDetailSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});
