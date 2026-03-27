import { supabase } from "../../config/supabase";
import { Customer } from "./customer.type";

const mapCustomer = (c: any): Customer => ({
  ...c,
  stateAbbr: c.state_abbr,
  groups: c.groups || [],
});

const mapToDb = (payload: Partial<Customer>) => {
  const { stateAbbr, groups, ...rest } = payload;

  return {
    ...rest,
    state_abbr: stateAbbr ?? null,
    groups: groups ?? [],
  };
};

export const getCustomers = async (body: any) => {
  const { pagination = {}, sort, filter } = body;

  let query = supabase.from("customers").select("*", { count: "exact" });

  if (filter) {
    if (filter.q) {
      query = query.or(
        `first_name.ilike.%${filter.q}%,last_name.ilike.%${filter.q}%,email.ilike.%${filter.q}%`,
      );
    }

    if (filter.has_newsletter !== undefined) {
      const val = filter.has_newsletter === "true";
      query = query.eq("has_newsletter", val);
    }

    if (filter.groups) {
      query = query.contains("groups", [filter.groups]);
    }
  }

  if (sort?.field) {
    query = query.order(sort.field, {
      ascending: sort.order === "ASC",
    });
  }

  const page = pagination.page || 1;
  const perPage = pagination.perPage || 10;

  const from = (page - 1) * perPage;
  const to = from + perPage - 1;

  query = query.range(from, to);

  const { data, error, count } = await query;

  if (error) throw error;

  return {
    data: (data || []).map(mapCustomer),
    total: count || 0,
    page,
    perPage,
  };
};

export const getCustomerById = async (id: number) => {
  if (!id) throw new Error("Customer ID is required");

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  if (!data) throw new Error("Customer not found");

  return mapCustomer(data);
};

export const createCustomer = async (payload: Partial<Customer>) => {
  if (!payload.email) {
    throw new Error("Email is required");
  }

  const now = new Date().toISOString();

  const insertData = {
    first_name: payload.first_name || "",
    last_name: payload.last_name || "",
    email: payload.email,
    address: payload.address ?? null,
    zipcode: payload.zipcode ?? null,
    city: payload.city ?? null,
    state_abbr: payload.stateAbbr ?? null,
    avatar: payload.avatar ?? null,
    birthday: payload.birthday ?? null,
    groups: payload.groups ?? [],
    first_seen: now,
    last_seen: now,
    has_ordered: false,
    latest_purchase: null,
    has_newsletter: false,
    nb_orders: 0,
    total_spent: 0,
  };

  const { data, error } = await supabase
    .from("customers")
    .insert([insertData])
    .select()
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new Error("Email already exists");
    }

    throw new Error("Failed to create customer");
  }

  return mapCustomer(data);
};

export const updateCustomer = async (
  id: number,
  payload: Partial<Customer>,
) => {
  if (!id) throw new Error("Customer ID is required");

  const updateData = mapToDb(payload);

  const { data, error } = await supabase
    .from("customers")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE ERROR:", error);
    throw error;
  }

  if (!data) throw new Error("Customer not found");

  return mapCustomer(data);
};

export const deleteCustomers = async (ids: number[]) => {
  if (!ids || ids.length === 0) {
    throw new Error("IDs are required");
  }

  const { error } = await supabase.from("customers").delete().in("id", ids);

  if (error) {
    console.error("DELETE ERROR:", error);
    throw error;
  }

  return true;
};
