export interface IProductProps {
  id: number;
  name: string;
  price: number;
  stocks: {
    store_id: number;
    product_id: number;
    stock_quantity: number;
  }[];
  images: {
    id: number;
    product_id: number;
    image_url: string;
  }[];
  province: string;
  category: {
    id: number;
    category: string;
  };
  is_active: boolean;
}
