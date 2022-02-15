export interface Profile {
  id: number;
  phone?: string;
  email: string;
  ticketsIds: number[];
  password: string;
  createdAt: string;
  updatedAt: string;
}
