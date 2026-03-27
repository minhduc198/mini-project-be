export type OrderStatus = "ordered" | "delivered" | "cancelled";

export type BasketItem = {
  product_id: number;
  quantity: number;
  price: number;
};

export type Order = {
  id: number;
  reference: string;
  date: string;
  customer_id: number;
  total_ex_taxes: number;
  delivery_fees: number;
  tax_rate: number;
  taxes: number;
  total: number;
  status: OrderStatus;
  returned: boolean;
  address?: string;
  basket: BasketItem[];
};

export interface GetOrdersListRequest {
  pagination: {
    page: number;
    perPage: number;
  };
  sort?: {
    field: string;
    order: "ASC" | "DESC";
  };
  filter?: {
    status?: OrderStatus;
    customer_id?: number;
    date_gte?: string;
    date_lte?: string;
    total_gte?: number;
    total_lte?: number;
    q?: string;
  };
}
