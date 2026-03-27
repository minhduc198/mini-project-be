export type Product = {
  id: number;
  inventory_id: number;
  reference: string;
  width: number;
  height: number;
  price: number;
  thumbnail: string;
  image: string;
  description: string;
  sales: number;
  quantity?: number;
};

export interface ApiResponse<T> {
  data: T;
}

export interface ApiResponseList<T> {
  data: T[];
  total: number;
  page: number;
  perPage: number;
}

export type GetProductsListResponse = ApiResponseList<Product>;
export type GetProductDetailResponse = ApiResponse<Product>;

export interface CreateProductRequest {
  data: Partial<Omit<Product, "id">>;
}
