export interface Flight {
  id: number;
  date: string;
  time: string;
  departure: string;
  destination: string;
  prices: {
    economy: number;
    business: number;
    deluxe: number;
  };
  totalNumber: {
    economy: number;
    business: number;
    deluxe: number;
  };
  avaliableNumber: {
    economy: number;
    business: number;
    deluxe: number;
  };
  createdAt: string;
}
