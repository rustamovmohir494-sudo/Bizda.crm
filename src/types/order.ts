export interface Order {
  id: number | string;
  status?: string;
  total?: number;
  customerId?: number | string;
  createdAt?: string;
}