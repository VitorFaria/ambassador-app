export interface ICheckoutItems {
  price_data: IPriceData;
  quantity: number;
}

interface IPriceData {
  currency: string;
  unit_amount: number;
  product_data: IProductData;
}

interface IProductData {
  name: string;
  description: string;
  images: string[];
}