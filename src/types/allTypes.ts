export type ICategory = {
  readonly category: "vegetables" | "herbs";
};

export interface IMinProduct {
  label: string;
  description: string;
  price: number;
  eachOrWeigth: string;
  isOffer: boolean;
  stillGrowing: boolean;
  soldOut: boolean;
  inSeason: boolean;
  sellingFast: boolean;
  popular: boolean;
  comingSoon: boolean;
  image: string;
}

export interface IAddProduct extends ICategory, IMinProduct{};

export interface IGetMinIdProduct extends ICategory, IMinProduct{};

export interface IGetProduct extends ICategory, IMinProduct {
  id: string;
}

export interface IProduct extends IAddProduct {
  id: string;
}

export interface IGetProduct extends IMinProduct {
  id: string;
}

export type Keys<U> = keyof U;
//export type Values<T> = T[Keys<U>]