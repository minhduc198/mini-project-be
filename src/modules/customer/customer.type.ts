export type Groups =
  | "compulsive"
  | "collector"
  | "ordered_once"
  | "regular"
  | "returns"
  | "reviewer";

export type Customer = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  address: string | null;
  zipcode: string | null;
  city: string | null;
  stateAbbr: string | null;
  avatar: string | undefined;
  birthday: string | null;
  first_seen: string;
  last_seen: string;
  has_ordered: boolean;
  latest_purchase: string | null;
  has_newsletter: boolean;
  groups: Groups[];
  nb_orders: number;
  total_spent: number;
};

export type GetCustomerDetailResponse = {
  data: Customer;
};

export interface ApiResponseList<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export type CustomerListResponse = ApiResponseList<Customer>;

export interface CreateCustomerRequest {
  data: Partial<Omit<Customer, "id">>;
}

export interface UpdateCustomerRequest {
  id: number;
  data: Partial<Omit<Customer, "id">>;
}

export type DeleteCustomersRequest = {
  ids: number[];
};
