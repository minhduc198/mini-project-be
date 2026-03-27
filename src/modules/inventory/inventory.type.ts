export type Inventory = {
  id: number;
  name: string;
  image: string;
  stock: number;
};

export interface ApiResponse<T> {
  data: T;
}

export type GetInventoriesListResponse = ApiResponse<Inventory[]>;

export type GetInventoryDetailResponse = ApiResponse<Inventory>;

export type GetInventoryDetailRequest = {
  id: number;
};

export interface UpdateInventoryRequest {
  id: number | null;
  data: Partial<Omit<Inventory, "id">>;
}
