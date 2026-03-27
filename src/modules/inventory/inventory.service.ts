import { supabase } from "../../config/supabase";
import { Inventory } from "./inventory.type";

export const getInventories = async () => {
  const { data, error } = await supabase
    .from("inventories")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;

  return data || [];
};

export const getInventoryById = async (id: number) => {
  if (!id) throw new Error("ID is required");

  const { data, error } = await supabase
    .from("inventories")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Inventory not found");

  return data;
};

export const createInventory = async (payload: Partial<Inventory>) => {
  const insertData = {
    name: payload.name || "",
    image: payload.image || "",
    stock: payload.stock || 0,
  };

  const { data, error } = await supabase
    .from("inventories")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error("CREATE INVENTORY ERROR:", error);
    throw error;
  }

  return data;
};

export const updateInventory = async (
  id: number,
  payload: Partial<Inventory>,
) => {
  if (!id) throw new Error("ID is required");

  const { data, error } = await supabase
    .from("inventories")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE INVENTORY ERROR:", error);
    throw error;
  }

  if (!data) throw new Error("Inventory not found");

  return data;
};

export const deleteInventories = async (ids: number[]) => {
  if (!ids || ids.length === 0) {
    throw new Error("IDs are required");
  }

  const { error } = await supabase.from("inventories").delete().in("id", ids);

  if (error) {
    console.error("DELETE INVENTORY ERROR:", error);
    throw error;
  }

  return true;
};
