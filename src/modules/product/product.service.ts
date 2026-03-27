import { supabase } from "../../config/supabase";
import { Product } from "./product.type";

/**
 * =========================
 * GET LIST
 * =========================
 */
export const getProducts = async (body: any) => {
  const { pagination = {}, sort, filter } = body;

  let query = supabase.from("products").select("*", { count: "exact" });

  // 🔍 FILTER
  if (filter) {
    if (filter.q) {
      query = query.ilike("reference", `%${filter.q}%`);
    }

    if (filter.inventory_id) {
      query = query.eq("inventory_id", Number(filter.inventory_id));
    }

    if (filter.stock) {
      query = query.gte("stock", Number(filter.stock));
    }

    if (filter.sale) {
      query = query.gte("sales", Number(filter.sale));
    }

    if (filter.id) {
      query = query.in("id", filter.id);
    }
  }

  // 🔀 SORT
  if (sort?.field) {
    query = query.order(sort.field, {
      ascending: sort.order === "ASC",
    });
  }

  // 📄 PAGINATION
  const page = pagination.page || 1;
  const perPage = pagination.perPage || 10;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) {
    console.error("GET PRODUCTS ERROR:", error);
    throw error;
  }

  return {
    data: data || [],
    total: count || 0,
    page,
    perPage,
  };
};

/**
 * =========================
 * GET DETAIL
 * =========================
 */
export const getProductById = async (id: number) => {
  if (!id) throw new Error("ID is required");

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Product not found");

  return data;
};

export const createProduct = async (payload: Partial<Product>) => {
  const insertData = {
    inventory_id: payload.inventory_id || null,
    reference: payload.reference || "",
    width: payload.width || 0,
    height: payload.height || 0,
    price: payload.price || 0,
    thumbnail: payload.thumbnail || "",
    image: payload.image || "",
    description: payload.description || "",
    sales: 0,
  };

  const { data, error } = await supabase
    .from("products")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("CREATE PRODUCT ERROR:", error);
    throw error;
  }

  return data;
};

/**
 * =========================
 * UPDATE
 * =========================
 */
export const updateProduct = async (id: number, payload: Partial<Product>) => {
  if (!id) throw new Error("ID is required");

  const { data, error } = await supabase
    .from("products")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE PRODUCT ERROR:", error);
    throw error;
  }

  if (!data) throw new Error("Product not found");

  return data;
};

/**
 * =========================
 * DELETE
 * =========================
 */
export const deleteProducts = async (ids: number[]) => {
  if (!ids || ids.length === 0) {
    throw new Error("IDs are required");
  }

  const { error } = await supabase.from("products").delete().in("id", ids);

  if (error) {
    console.error("DELETE PRODUCT ERROR:", error);
    throw error;
  }

  return true;
};
