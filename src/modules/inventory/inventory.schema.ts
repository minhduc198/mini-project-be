import { z } from "zod";

export const getInventoriesSchema = z.object({});

export const getInventoryDetailSchema = z.object({
  params: z.object({
    id: z.string(),
  }),
});

export const createInventorySchema = z.object({
  body: z.object({
    data: z.object({
      name: z.string(),
      image: z.string().optional(),
    }),
  }),
});

export const updateInventorySchema = z.object({
  body: z.object({
    id: z.number().nullable(),
    data: z.object({}).passthrough(),
  }),
});

export const deleteInventorySchema = z.object({
  body: z.object({
    ids: z.array(z.number()),
  }),
});
