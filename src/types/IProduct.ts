export interface IProduct {
  id: number;
  category: string;
  dataKey: string;
  label: string;
  price: number;
  isOffer: boolean;
  perItem: boolean;
  image: string;
  description: string;
  soldOut: boolean;
}