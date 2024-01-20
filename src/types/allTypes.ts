export type ICategory = {
  readonly category: "vegetables" | "herbs";
};

export type IId = {
  readonly id: string;
};

export interface IMinProduct {
  label: string;
  description: string;
  stockLevel: number;
  price: number | string;
  eachOrWeigth: string;
  banner: string;
  image: string;
}

export interface IAddProduct extends ICategory, IMinProduct {}

export interface IGetMinIdProduct extends ICategory, IMinProduct {}

export interface IGetProduct extends ICategory, IMinProduct, IId {}

export interface IUpdateProduct extends IId {
  label?: string;
  description?: string;
  stockLevel?: number;
  price?: string | number;
  eachOrWeigth?: string;
  banner?: "";
  image?: string;
}

export interface IProduct extends IAddProduct {
  id: string;
}

export interface IGetProduct extends IMinProduct {
  id: string;
}

export interface IOrder {
  name: string;
  addressLineOne: string;
  addressLineTwo: string;
  town: string;
  postcode: string;
  orderNr: string;
  email: string;
  phone: string;
  price: number;
  timestamp: string;
}

export interface IAddOrder extends IOrder {
  processed: boolean;
  order: string;
  id: string;
}

export interface IGetOrder extends IOrder {
  processed: boolean;
  order: IGetProduct[];
}

export type Keys<U> = keyof U;
//export type Values<T> = T[Keys<U>]
