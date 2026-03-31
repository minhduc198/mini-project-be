import { supabase } from "../../config/supabase";
import { BasketItem, Order } from "./order.type";

export const getOrders = async (body: any) => {
  const { pagination = {}, sort, filter } = body;

  let query = supabase
    .from("orders")
    .select(
      `
      *,
      customer:customers (
        first_name,
        last_name,
        avatar
      ),
      order_items (
        product_id,
        quantity,
        price
      )
    `,
      { count: "exact" },
    )
    .is("deleted_at", null);

  if (filter) {
    if (filter.status) {
      query = query.eq("status", filter.status);
    }

    if (filter.customer_id) {
      query = query.eq("customer_id", filter.customer_id);
    }

    if (filter.reference) {
      query = query.ilike("reference", `%${filter.reference}%`);
    }

    if (filter.date_from) {
      query = query.gte("date", filter.date_from);
    }

    if (filter.date_to) {
      query = query.lte("date", filter.date_to);
    }

    if (filter.date) {
      query = query
        .gte("date", `${filter.date}T00:00:00`)
        .lte("date", `${filter.date}T23:59:59`);
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

  const mapped =
    data?.map((order: any) => {
      const basket =
        order.order_items?.map((i: any) => ({
          product_id: i.product_id,
          quantity: i.quantity,
          price: i.price,
        })) || [];

      return {
        ...order,
        basket,
        nb_items: basket.reduce((sum: number, i: any) => sum + i.quantity, 0),
      };
    }) || [];

  return {
    data: mapped,
    total: count || 0,
    page,
    perPage,
  };
};

export const getOrderById = async (id: number) => {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      order_items (
        product_id,
        quantity,
        price
      )
    `,
    )
    .eq("id", id)
    .single();

  if (error) throw error;

  const basket =
    data.order_items?.map((i: any) => ({
      product_id: i.product_id,
      quantity: i.quantity,
      price: i.price,
    })) || [];

  return {
    ...data,
    basket,
  };
};

export const createOrder = async (payload: any) => {
  const {
    customer_id,
    basket = [],
    address,
    tax_rate = 0,
    delivery_fees = 0,
  } = payload;

  if (!customer_id || !basket.length) {
    throw new Error("Invalid order data");
  }

  const subtotal = basket.reduce(
    (sum: number, i: any) => sum + i.quantity * (i.price ?? 0),
    0,
  );

  const taxes = subtotal * (tax_rate / 100);
  const total = subtotal + taxes + delivery_fees;

  const { data: order, error } = await supabase
    .from("orders")
    .insert([
      {
        reference: `ORD-${Date.now()}`,
        customer_id,
        address,
        tax_rate,
        delivery_fees,
        total_ex_taxes: subtotal,
        taxes,
        total,
        status: "ordered",
      },
    ])
    .select()
    .single();

  if (error) throw error;

  const items = basket.map((i: any) => ({
    order_id: order.id,
    product_id: i.product_id,
    quantity: i.quantity,
    price: i.price ?? 0,
  }));

  const { error: itemError } = await supabase.from("order_items").insert(items);

  if (itemError) throw itemError;

  return order;
};

export const updateOrder = async (id: number, payload: Order) => {
  const {
    customer_id,
    address,
    basket = [],
    tax_rate = 0,
    delivery_fees = 0,
  } = payload;

  if (!customer_id) {
    throw new Error("Missing customer_id");
  }

  const cleanBasket = basket.filter((i: BasketItem) => i.product_id);

  if (!cleanBasket.length) {
    throw new Error("Basket empty");
  }

  const subtotal = cleanBasket.reduce(
    (sum: number, i: BasketItem) => sum + i.quantity * (i.price ?? 0),
    0,
  );

  const taxes = subtotal * (tax_rate / 100);
  const total = subtotal + taxes + delivery_fees;

  const { data, error } = await supabase
    .from("orders")
    .update({
      customer_id,
      address,
      tax_rate,
      delivery_fees,
      total_ex_taxes: subtotal,
      taxes,
      total,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE ORDER ERROR:", error);
    throw error;
  }

  const { error: deleteError } = await supabase
    .from("order_items")
    .delete()
    .eq("order_id", id);

  if (deleteError) {
    console.error("DELETE ITEMS ERROR:", deleteError);
    throw deleteError;
  }

  const items = cleanBasket.map((i: BasketItem) => ({
    order_id: id,
    product_id: i.product_id,
    quantity: i.quantity,
    price: i.price ?? 0,
  }));

  const { error: insertError } = await supabase
    .from("order_items")
    .insert(items);

  if (insertError) {
    console.error("INSERT ITEMS ERROR:", insertError);
    throw insertError;
  }

  return data;
};

export const deleteOrders = async (ids: number[]) => {
  if (!ids?.length) throw new Error("IDs required");

  const { error } = await supabase
    .from("orders")
    .update({ deleted_at: new Date().toISOString() })
    .in("id", ids);

  if (error) throw error;

  return true;
};
