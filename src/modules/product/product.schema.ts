import { z } from "zod";

export const getProductsSchema = z.object({
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
        sale: z.string().optional(),
        inventory_id: z.string().optional(),
        q: z.string().optional(),
        id: z.array(z.number()).optional(),
      })
      .optional(),
  }),
});

export const getProductDetailSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const createProductSchema = z.object({
  body: z.object({
    data: z.object({
      reference: z.string(),
      price: z.number(),
    }),
  }),
});

export const updateProductSchema = z.object({
  body: z.object({
    id: z.number(),
    data: z.object({}).passthrough(),
  }),
});

export const deleteProductSchema = z.object({
  body: z.object({
    ids: z.array(z.number()),
  }),
});
